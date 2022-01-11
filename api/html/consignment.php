<html>
<head>
<title>Consignment</title>
<style type="text/css">
@page{
    margin: 0pt;
}
body {
    font-family:"Courier";
}
body p {
    margin: 0pt;
    margin-bottom: 4pt;
    font-size: 12pt;
}
.wrapper {
    margin-top: <?= $option['TopMargin'] ?>pt;
    margin-left: <?= $option['LeftMargin'] ?>pt;
    margin-right: <?= $option['RightMargin'] ?>pt;
    margin-bottom: <?= $option['BottomMargin'] ?>pt;
}
.top-right {
    float: right;
}
.customers {
    clear: both;
    margin-top: 115pt;
    margin-left: 40pt;
}
.customers td {
    /*border: 1pt solid #000;*/
}
.customers .consignor {
    width: 260pt;
}
.customers table td {
    /*width: 250pt;*/
}
.items {
    margin-left: -10pt;
    margin-top: 48pt;
    height: 150pt;
    overflow: hidden;
}
.items table td {
    /*border: 1pt solid #000;*/
    height: 20pt;
}
.items .no-of-articles {
    width: 20pt;
}
.items .item-description {
    width: 90pt;
}
.items .item-subtotal {
    text-align: right;
}
.totals td {
    /*border: 1pt solid #000;*/
    text-align: right;
    height: 20pt;
}
.totals .empty {
    width: 160pt;
}
.grand-total {
    margin-top: 3pt;
}
.payment-mode {
    float: right;
    margin-top: 18pt;
}
.payment-mode p {
    font-size: 18pt;
}
</style>
</head>

<body>
<div class="wrapper">
    <div class="top">
        <div class="top-right">
            <p><?= $consignment['LRNumber'] ?></p>
            <p><?= $consignment['ConsignmentDate'] ?></p>
        </div>
        <div class="customers">
            <table width="100%" cellpadding=0 cellspacing=0>
                <tr>
                    <td class="consignor"><p><?= $consignment['Consignor']['Name'] ?></p></td>
                    <td class="consignee"><p><?= $consignment['Consignee']['Name'] ?></p></td>
                </tr>
                <tr>
                    <td><p><?= $consignment['FromCity'] ?></p></td>
                    <td><p><?= $consignment['ToCity'] ?></p></td>
                </tr>
            </table>
        </div>
        <div class="items">
            <table width="100%" cellpadding=0 cellspacing=0>
                <tr>
                    <td><p class="no-of-articles"><?= $consignment['NoOfItems'] ?></p></td>
                    <td><p class="item-description"><?= $consignment['Description'] ?></p></td>
                    <td><p class="item-weight"><?= $consignment['ChargedWeightKgs'] ?></p></td>
                    <td><p class="item-subtotal"><?= $consignment['FreightCharge'] ?></p></td>
                </tr>
            </table>
        </div>
        <div class="totals">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td><p class="empty">&nbsp;</p></td>
                    <td><p>&nbsp;<!--<?= $consignment['GSTPercent'] ?>--></p></td>
                    <td><p>&nbsp;<!--<?= $consignment['GSTAmount'] ?>--></p></td>
                </tr>
                <tr>
                    <td><p class="empty">&nbsp;</p></td>
                    <td><p>&nbsp;</p></td>
                    <td><p class="grand-total">&nbsp;<!--<?= \number_format($consignment['Total'], 2) ?>--></p></td>
                </tr>
            </table>
        </div>
    </div>
    <div class="payment-mode">
        <p><?= $consignment['PaymentMode'] ?></p>
    </div>
</div>
</body>

</html>
