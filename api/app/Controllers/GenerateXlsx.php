<?php namespace Controllers;

use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
use Classes\ConsignmentSearch;

class GenerateXlsx extends BaseController
{
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
        $searchParams['startDate'] = $this->convertToMysqlDate($params['dateRange']['begin']);
        $searchParams['endDate'] = $this->convertToMysqlDate($params['dateRange']['end']);
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
}
