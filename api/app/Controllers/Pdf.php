<?php namespace Controllers;

use Helpers\PdfGenerate;

class Pdf extends BaseController
{
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

        require(API_PATH."/html/consignment.php");

        $html = ob_get_contents();
        ob_end_clean();

        //echo $html;

        $pdf->generatePdf($html, $orientation, $psize, $width, $height);
    }

    function getOgplist($id) {
        \header('Content-Type: text/html');

        $pdf = new PdfGenerate();

        $psize = "A4";
        $orientation = "PORTRAIT";

        $sql = "SELECT * FROM ogplists WHERE Id = ?";
        $ogplist = $this->db->query($sql, [$id])->fetch();

        if (!$ogplist) throw new \Exception("Unable to fetch ogplist");
        $ogplist['OGPListDate'] = \date_format(\date_create($ogplist['OGPListDate']), "d-m-Y");

        $i_sql = "SELECT * FROM consignments WHERE OGP_Id = ?";
        $ogplist['Consignments'] = $this->db->query($i_sql, [ $ogplist['Id'] ])->fetchAll() ?: [];

        foreach ($ogplist['Consignments'] as &$consignment) {
          $consignor = $this->db->query('SELECT * FROM consignors WHERE Id = ?', [$consignment['ConsignorId']])->fetch();
          $consignee = $this->db->query('SELECT * FROM consignees WHERE Id = ?', [$consignment['ConsigneeId']])->fetch();
          if (!$consignor || !$consignee) throw new \Exception("Customer not found");
          $consignment['Consignor'] = $consignor;
          $consignment['Consignee'] = $consignee;

          $consignment['LRNumber'] = \str_pad( $consignment['LRNumber'], 4, '0', STR_PAD_LEFT);
          $total = $consignment['FreightCharge'] + $consignment['DeliveryCharges'] + $consignment['LoadingCharges'] + $consignment['UnloadingCharges'] + $consignment['GSTAmount'];
          $consignment['Total'] = $total;
        }

        $vehicle = $this->db->query('SELECT RegNumber FROM vehicles WHERE Id = ?', [$ogplist['VehicleId']])->fetch();
        if (!$vehicle) throw new \Exception("Unable to fetch vehicle");
        $ogplist['RegNumber'] = $vehicle['RegNumber'];

        $driver = $this->db->query('SELECT DriverName, DriverPhone FROM drivers WHERE Id = ?', [$ogplist['DriverId']])->fetch();
        if (!$driver) throw new \Exception("Unable to fetch driver");
        $ogplist['DriverName'] = $driver['DriverName'];
        $ogplist['DriverPhone'] = $driver['DriverPhone'];

        $fcity = $this->db->query('SELECT CityName FROM cities WHERE Id = ?', [$ogplist['FromCityId']])->fetch();
        $tcity = $this->db->query('SELECT CityName FROM cities WHERE Id = ?', [$ogplist['ToCityId']])->fetch();
        if (!$fcity || !$tcity) throw new \Exception("City not found");
        $ogplist['FromCity'] = $fcity['CityName'];
        $ogplist['ToCity'] = $tcity['CityName'];

        $ogplist['Balance'] = $ogplist['Rent'] - $ogplist['Advance'];

        ob_start();

        require(API_PATH."/html/ogplist.php");

        $html = ob_get_contents();
        ob_end_clean();

        //echo $html;

        $pdf->generatePdf($html, $orientation, $psize);
    }
}
