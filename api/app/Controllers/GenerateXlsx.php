<?php namespace Controllers;

use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
use Carbon\Carbon;
use Classes\ConsignmentSearch;
use Traits\PopulatesOGPList;

class GenerateXlsx extends BaseController
{
    use PopulatesOGPList;

    public function postAdvancedSearchConsignments()
    {
        $postData = $this->post();
        $params = json_decode($postData['data'], true);
        if (!in_array($params['customerType'], ['consignor', 'consignee'])) {
            throw new \Exception('Invalid search type');
        }
        $searchParams = [];
        $searchParams['customerType'] = $params['customerType'];
        $searchParams['paymentMode'] = $params['paymentMode'];
        $searchParams['searchId'] = $params['searchText']['Id'];
        $searchParams['startDate'] = $this->convertToMysqlDate($params['startDate']);
        $searchParams['endDate'] = $this->convertToMysqlDate($params['endDate']);
        $searchParams['pageIndex'] = $params['pageIndex'];
        $searchParams['pageSize'] = $params['pageSize'];
        $searchParams['offset'] = ($searchParams['pageIndex'] - 1) * $searchParams['pageSize'];
        $searchParams['limit'] = $params['pageSize'];

		if (!DEVELOPMENT) {
            $hostPos = strpos(strtolower($_SERVER['HTTP_REFERER']), strtolower($_SERVER['HTTP_HOST']));
            if ($hostPos === false || $hostPos > 10) {
                throw new \Exception("Invalid access");
            }
        }

		$search = new ConsignmentSearch();
		$consignments = $search->search($searchParams);

		if (sizeof($consignments) > 0)
		{
			$writer = WriterEntityFactory::createXLSXWriter();
			$writer->openToBrowser('advanced-search-' . time() . '.xlsx');

			// write headings
			$headings = array_keys($consignments[0]);
			$row = WriterEntityFactory::createRowFromArray($headings);
			$writer->addRow($row);

			// write values
			foreach ($consignments as $consignment) {
                $values = array_values($consignment);
				$row = WriterEntityFactory::createRowFromArray($values);
				$writer->addRow($row);
			}

			$writer->close();
		}
		else {
			throw new \Exception('No results found');
		}
    }

    public function postOgplist()
    {
        $postData = $this->post();
        $params = json_decode($postData['data'], true);
        if (!$params || (!$id = ($params['id'] ?? null))) {
            throw new \Exception('Invalid OGP List Specified');
        }

        $ogplist = $this->populateOGPList($id);

        $general = [
            ['Vehicle No:', $ogplist['RegNumber'], '', 'Driver Name:', $ogplist['DriverName'], '', 'Mobile No:', $ogplist['DriverPhone']],
            ['From:', $ogplist['FromCity'], '', 'To:', $ogplist['ToCity'], 'OGP No:', $ogplist['Id']],
        ];

        $getPaymentMode = function ($mode) {
            switch($mode) {
                case 1:
                    return 'Paid';
                case 2:
                    return 'ToPay';
                case 3:
                    return 'A/C';
                default:
                    return 'N/A';
            }
        };

        $source = collect($ogplist)->only('Consignments')->toArray();
        $consignments = collect($source['Consignments'])->transform(function ($consignment) use($getPaymentMode) {
            $result = [];
            $result['ConsignmentDate'] = Carbon::parse($consignment['ConsignmentDate'])->format('d-m-Y');
            $result['LRNumber'] = $consignment['LRNumber'];
            $result['Consignor'] = $consignment['Consignor']['Name'];
            $result['Consignee'] = $consignment['Consignee']['Name'];
            $result['LRNumber'] = $consignment['LRNumber'];
            $result['NoOfItems'] = $consignment['NoOfItems'];
            $result['Description'] = $consignment['Description'];
            $result['ChargedWeightKgs'] = $consignment['ChargedWeightKgs'];
            $result['FreightCharge'] = $consignment['FreightCharge'];
            $result['DeliveryCharges'] = $consignment['DeliveryCharges'];
            $result['LoadingCharges'] = $consignment['LoadingCharges'];
            $result['UnloadingCharges'] = $consignment['UnloadingCharges'];
            $result['Demurrage'] = $consignment['Demurrage'];
            $result['GSTAmount'] = $consignment['GSTAmount'];
            $result['InvoiceNumber'] = $consignment['InvoiceNumber'];
            $result['PaymentMode'] = $getPaymentMode((int)$consignment['PaymentMode']);
            $result['Total'] = $consignment['Total'];
            return $result;
        })->toArray();

        if (sizeof($consignments) > 0)
		{
			$writer = WriterEntityFactory::createXLSXWriter();
			$writer->openToBrowser('ogplist-' . $id . '-' . time() . '.xlsx');

            // write general
            foreach($general as $g) {
                $row = WriterEntityFactory::createRowFromArray($g);
                $writer->addRow($row);
            }

			// write headings
			$headings = array_keys($consignments[0]);
			$row = WriterEntityFactory::createRowFromArray($headings);
			$writer->addRow($row);

			// write values
			foreach ($consignments as $consignment) {
                $values = array_values($consignment);
				$row = WriterEntityFactory::createRowFromArray($values);
				$writer->addRow($row);
			}

			$writer->close();
		}
		else {
			throw new \Exception('No results found');
		}
    }
}
