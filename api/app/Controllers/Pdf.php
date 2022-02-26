<?php namespace Controllers;

use Helpers\PdfGenerate;
use Traits\PopulatesOGPList;

class Pdf extends BaseController
{
    use PopulatesOGPList;

    function getConsignment($id) {
        \header('Content-Type: text/html');

        $pdf = new PdfGenerate();

        $option = $this->db->query("SELECT `Value` FROM options WHERE `Option` = ?", ['LRPrintOptions'])->fetch();
        $option = $option ? \json_decode($option['Value'], true)
        : [
          'Width' => "624.4",
          'Height' => "450",
          'LeftMargin' => "25",
          'RightMargin' => "120",
          'TopMargin' => "40",
          'BottomMargin' => "0",
        ];

        $psize = "MANUAL";
        $width = $option['Width'];
        $height = $option['Height'];
        $orientation = "PORTRAIT";

        $sql = "SELECT * FROM consignments WHERE Id = ?";
        $consignment = $this->db->query($sql, [$id])->fetch();

        if (!$consignment) throw new \Exception("Unable to fetch consignment");
        $consignment['ConsignmentDate'] = \date_format(\date_create($consignment['ConsignmentDate']), "d-m-Y");

        $consignment['LRNumber'] = \str_pad( $consignment['LRNumber'], 4, '0', STR_PAD_LEFT);

        $fcity = $this->db->query('SELECT CityName FROM cities WHERE Id = ?', [$consignment['FromCityId']])->fetch();
        $tcity = $this->db->query('SELECT CityName FROM cities WHERE Id = ?', [$consignment['ToCityId']])->fetch();
        if (!$fcity || !$tcity) throw new \Exception("City not found");
        $consignment['FromCity'] = $fcity['CityName'];
        $consignment['ToCity'] = $tcity['CityName'];

        $consignor = $this->db->query('SELECT * FROM consignors WHERE Id = ?', [$consignment['ConsignorId']])->fetch();
        $consignee = $this->db->query('SELECT * FROM consignees WHERE Id = ?', [$consignment['ConsigneeId']])->fetch();
        if (!$consignor || !$consignee) throw new \Exception("Customer not found");
        $consignment['Consignor'] = $consignor;
        $consignment['Consignee'] = $consignee;

        $paymentModes = [1 => "PAID", "TO PAY", "A/C"];
        $consignment['PaymentMode'] = $paymentModes[$consignment['PaymentMode']];

        $total = $consignment['FreightCharge'] + $consignment['DeliveryCharges'] + $consignment['LoadingCharges'] + $consignment['UnloadingCharges'] + $consignment['GSTAmount'];
        $consignment['Total'] = $total;

        ob_start();

        require(API_PATH."/html/consignment-puppeteer.php");

        $html = ob_get_contents();
        ob_end_clean();

        //echo $html;

        //$pdf->generatePdf($html, $orientation, $psize, $width, $height);
        $pdf->generatePdfPuppeteer($html, ['width' => '220mm', 'height' => '159mm', 'format' => null], ['width' => 832, 'height' => 601]);
    }

    function getOgplist($id) {
        \header('Content-Type: text/html');

        $pdf = new PdfGenerate();

        $psize = "A4";
        $orientation = "PORTRAIT";

        $ogplist = $this->populateOGPList($id);

        ob_start();

        require(API_PATH."/html/ogplist-puppeteer.php");

        $html = ob_get_contents();
        ob_end_clean();

        //echo $html;

        //$pdf->generatePdf($html, $orientation, $psize);
        $pdf->generatePdfPuppeteer($html, [], null);
    }
}
