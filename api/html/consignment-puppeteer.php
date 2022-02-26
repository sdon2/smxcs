<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta charset="utf-8" />
    <style type="text/css">
            .t {
                transform-origin: bottom left;
                z-index: 2;
                position: absolute;
                white-space: pre;
                overflow: visible;
                line-height: 1.5;
                font-family: 'Arial', Courier, monospace;
            }

            .text-container {
                white-space: pre;
            }

            @supports (-webkit-touch-callout: none) {
                .text-container {
                    white-space: normal;
                }
            }

            #p1 {
                overflow: hidden;
                position: relative;
                background-color: white;
                width: 953px;
                height: 687px;
            }

            #t1_1 {
                left: 99px;
                bottom: 487px;
                letter-spacing: 0.2px;
            }

            #t2_1 {
                left: 497px;
                bottom: 487px;
                letter-spacing: 0.2px;
            }

            #t3_1 {
                left: 99px;
                bottom: 461px;
                letter-spacing: 0.2px;
            }

            #t4_1 {
                left: 497px;
                bottom: 461px;
                letter-spacing: 0.2px;
            }

            #t5_1 {
                left: 23px;
                bottom: 359px;
            }

            #t6_1 {
                left: 105px;
                bottom: 359px;
                letter-spacing: 0.2px;
            }

            #t7_1 {
                left: 475px;
                bottom: 359px;
                letter-spacing: 0.2px;
            }

            #t8_1 {
                left: 705px;
                bottom: 359px;
                letter-spacing: 0.2px;
            }

            #t9_1 {
                left: 661px;
                bottom: 602px;
                letter-spacing: 0.2px;
            }

            #ta_1 {
                left: 661px;
                bottom: 575px;
                letter-spacing: 0.2px;
            }

            #tb_1 {
                left: 672px;
                bottom: 30px;
                letter-spacing: -0.3px;
            }

            .s1 {
                font-size: 18px;
                font-family: Courier;
                color: #000;
            }

            .s2 {
                font-size: 28px;
                font-family: Courier;
                color: #000;
            }
        </style>
</head>

<body style="margin: 0;">
    <div id="p1">
        <div class="text-container">
            <span id="t9_1" class="t s1"><?= $consignment['LRNumber'] ?></span>
            <span id="ta_1" class="t s1"><?= $consignment['ConsignmentDate'] ?></span>
            <span id="t1_1" class="t s1"><?= $consignment['Consignor']['Name'] ?></span>
            <span id="t2_1" class="t s1"><?= $consignment['Consignee']['Name'] ?></span>
            <span id="t3_1" class="t s1"><?= $consignment['FromCity'] ?></span>
            <span id="t4_1" class="t s1"><?= $consignment['ToCity'] ?></span>
            <span id="t5_1" class="t s1"><?= $consignment['NoOfItems'] ?></span>
            <span id="t6_1" class="t s1"><?= $consignment['Description'] ?></span>
            <span id="t7_1" class="t s1"><?= $consignment['ChargedWeightKgs'] ?></span>
            <span id="t8_1" class="t s1"><?= $consignment['FreightCharge'] ?></span>
            <span id="tb_1" class="t s2"><?= $consignment['PaymentMode'] ?></span>
        </div>
    </div>
</body>

</html>
