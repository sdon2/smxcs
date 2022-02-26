<html>
<head>
<title>OGP List</title>
<style type="text/css">
@page{
    margin: 25pt;
}
body {
    font-family:"Arial";
    font-size: 9pt;
}
.header {
    text-align: center;
}
h1,h2,h3,h4,h5,h6,p {
    margin: 0pt;
    margin-bottom: 5pt;
}
hr {
    border: none;
    border-bottom: 1pt solid #000;
    margin: 0pt;
    margin-top: 5pt;
    margin-bottom: 5pt;
}
.header, hr {
    margin-bottom: 10pt;
}
.general-details, .consignment-details, .rent-details, .other-details, .signature {
    margin-bottom: 20pt;
    font-size: 9pt;
}
.general-details tr > td {
    padding-bottom: 5px;
}
th {
    text-align: center;
}
.consignment-details th, .consignment-details td {
    text-align: left;
    padding: 5pt 10pt;
    border: 1pt solid #000;
}
td.align-right, th.align-right {
    text-align: right;
}
th.align-center, th.align-center {
    text-align: center;
}
</style>
</head>

<body>
    <div class="header">
        <h2>SRI MEENAKSHI XPRESS CARGO SERVICE</h2>
        <p>#78, Cauvery Street, 3rd Cross, Odakkad, Tirupur - 9361110015, 9361110030, 9361110035</p>
    </div>
    <hr/>
    <table class="general-details" cellspacing="0" cellpadding="0" width="100%">
        <tr>
            <th colspan="2" class="align-center"><h1>OUTGOING PARCEL LIST</h1></th>
        </tr>
        <tr>
            <td width="50%"><b>Vehicle No:</b> <?= $ogplist['RegNumber'] ?></td>
            <td width="50%">&nbsp;</td>
        </tr>
        <tr>
            <td><b>Driver Name:</b> <?= $ogplist['DriverName'] ?></td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td><b>Mobile No:</b> <?= $ogplist['DriverPhone'] ?></td>
            <td class="align-right"><b>Date:</b> <?= $ogplist['OGPListDate'] ?></td>
        </tr>
        <tr>
            <td><b><u>From: <?= $ogplist['FromCity'] ?> To: <?= $ogplist['ToCity'] ?></u></b></td>
            <td class="align-right"><b>OGP No:</b> <?= $ogplist['Id'] ?></td>
        </tr>
    </table>
    <table class="consignment-details" cellspacing="0" cellpadding="0" width="100%">
        <tr>
            <th>#</th>
            <th>L.R No</th>
            <th>To</th>
            <th>Qty</th>
            <th>Articles</th>
            <th class="align-right">A/C</th>
            <th class="align-right">Paid</th>
            <th class="align-right">To Pay</th>
        </tr>
        <?php $format_number = function ($number) { return \number_format($number, 2); }; ?>
        <?php $qty_total = 0; $ac_total = 0; $paid_total = 0; $topay_total = 0; ?>
        <?php foreach($ogplist['Consignments'] as $index=>$_consignment) { ?>
        <tr>
            <td><?= ($index + 1) ?>
            <td><?= $_consignment['LRNumber'] ?></td>
            <td><?= substr($_consignment['Consignee']['Name'], 0, 15)  ?></td>
            <td><?= $_consignment['NoOfItems'] ?></td>
            <?php $qty_total += $_consignment['NoOfItems']; ?>
            <td><?= substr($_consignment['Description'], 0, 5) ?></td>
            <?php $paid = ($_consignment['PaymentMode'] == 1) ? $_consignment['Total'] : 0; ?>
            <?php $topay = ($_consignment['PaymentMode'] == 2) ? $_consignment['Total'] : 0; ?>
            <?php $ac = ($_consignment['PaymentMode'] == 3) ? $_consignment['Total'] : 0; ?>
            <td class="align-right"><?= $ac == 0 ? "0.00" : $format_number($ac) ?></td>
            <td class="align-right"><?= $paid == 0 ? "0.00" : $format_number($paid) ?></td>
            <td class="align-right"><?= $topay == 0 ? "0.00" : $format_number($topay) ?></td>
            <?php $ac_total += $ac; $paid_total += $paid; $topay_total += $topay; ?>
        </tr>
        <?php } ?>
        <tr>
            <th colspan="3" class="align-right">Total</th>
            <th><?= $qty_total ?></th>
            <th>&nbsp;</th>
            <th class="align-right"><?= $format_number($ac_total) ?></th>
            <th class="align-right"><?= $format_number($paid_total) ?></th>
            <th class="align-right"><?= $format_number($topay_total) ?>
        </tr>
        <tr>
            <th colspan="3" class="align-right">Total Booking</th>
            <th><?= $qty_total ?></th>
            <th colspan="3">&nbsp;</th>
            <th class="align-right"><?= $format_number($ac_total + $paid_total + $topay_total) ?>
        </tr>
    </table>
    <div class="rent-details">
        <p><b>Rent: </b><?= $ogplist['Rent'] ?></p>
        <p><b>Advance: </b><?= $ogplist['Advance'] ?></p>
        <p><b>Balance: </b><?= $format_number($ogplist['Balance']) ?></p>
    </div>
    <div class="other-details">
        <p>Net Balance To-Pay in : <b>Tirupur</b></p>
        <p><?= $ogplist['RegNumber'] ?> Out Time <b><?= \date_format(new \DateTime(), 'd/m/Y h:i A') ?></b></p>
    </div>
    <table class="signature" width="100%" cellspacing="0" cellpadding="0">
        <tr><th>Driver</th><th>Loaded Person</th><th>Authorised</th></tr>
    </table>
</body>

</html>
