<?php

namespace Classes;

use Helpers\DB;

class ConsignmentSearch
{
    protected $db;

    public function __construct()
    {
        $this->db = new DB(DB_HOST, DB_NAME, DB_USER, DB_PASSWORD);
    }

    public function normalSearch($searchParams, &$pageStats)
    {
        $params = [$searchParams['startDate'], $searchParams['endDate']];
        $customerTableName = $searchParams['customerType'];
        // Search
        $sql = <<<SQL
SELECT SQL_CALC_FOUND_ROWS consignments.* FROM consignments
JOIN consignors ON consignments.ConsignorId = consignors.Id
JOIN consignees ON consignments.ConsigneeId = consignees.Id
WHERE (consignments.ConsignmentDate >= ? AND consignments.ConsignmentDate <= ?)
SQL;
        if ((int)$searchParams['searchId'] !== -1) {
            $sql .= " AND ({$customerTableName}s.Id = ?)";
            array_push($params, $searchParams['searchId']);
        }

        if ((int)$searchParams['paymentMode'] !== -1) {
            $sql .= " AND (consignments.PaymentMode = ?)";
            array_push($params, $searchParams['paymentMode']);
        }

        $sql .= " ORDER BY consignments.ConsignmentDate, consignments.Id DESC LIMIT {$searchParams['offset']}, {$searchParams['limit']}";
        $searchParams['sql'] = $sql;
        $consignments = $this->db->query($sql, $params)->fetchAll() ?: [];
        $items = $this->db->query('SELECT FOUND_ROWS() as totalItems')->fetch();
        $pageStats['totalItems'] = $items ? $items['totalItems'] ?: 0 : 0;
        $pageStats['pageSize'] = $searchParams['pageSize'];
        $pageStats['pageIndex'] = $searchParams['pageIndex'];
        foreach($consignments as &$consignment)
            $this->populateSubItems($consignment);
        return $consignments;
    }

    public function search($searchParams)
    {
        $params = [$searchParams['startDate'], $searchParams['endDate']];
        $customerTableName = $searchParams['customerType'] === 'consignor' ? 't2' : 't3';
        // Search
        $sql = <<<SQL
SELECT
t1.LRNumber as `LR Number`, DATE_FORMAT(t1.ConsignmentDate, '%d/%m/%Y') as `Date`,
t2.Name as Consignor, t3.Name as Consignee,
t1.Description, t4.CityName as `From`, t5.CityName as `To`,
t1.NoOfItems as `No of Items`,
t1.ChargedWeightKgs as `Weight (Kgs)`,
t1.FreightCharge as `Freight Charges`, t1.DeliveryCharges as `Delivery Charges`,
t1.LoadingCharges as `Loading Charges`, t1.UnloadingCharges as `Unloading Charges`,
t1.Demurrage,
(
    CASE WHEN t1.PaymentMode = 1 THEN "CASH"
        WHEN t1.PaymentMode = 2 THEN "TO PAY"
        WHEN t1.PaymentMode = 3 THEN "ACCOUNT PAY"
    END
) as `Payment Mode`
FROM consignments t1
JOIN consignors t2 ON t1.ConsignorId = t2.Id
JOIN consignees t3 ON t1.ConsigneeId = t3.Id
JOIN cities t4 ON t1.FromCityId = t4.Id
JOIN cities t5 ON t1.ToCityId = t5.Id
WHERE (t1.ConsignmentDate >= ? AND t1.ConsignmentDate <= ?)
SQL;
        if ((int)$searchParams['searchId'] !== -1) {
            $sql .= " AND ({$customerTableName}.Id = ?)";
            array_push($params, $searchParams['searchId']);
        }

        if ((int)$searchParams['paymentMode'] !== -1) {
            $sql .= " AND (t1.PaymentMode = ?)";
            array_push($params, $searchParams['paymentMode']);
        }

        $sql .= " ORDER BY t1.ConsignmentDate, t1.Id DESC";
        $searchParams['sql'] = $sql;
        $consignments = $this->db->query($sql, $params)->fetchAll() ?: [];
        return $consignments;
    }

    public function convertToNormalDate($date) {
        // Format mysql date to local date
        $datetime = new \DateTime();
        $datetime->setTimestamp(strtotime($date));
        $format = 'd/m/Y';
        return \date_format($datetime, $format);
    }

    protected function populateSubItems(&$consignment) {
        $consignment['Consignor'] = $this->db->query("SELECT * FROM consignors WHERE Id = ?", [$consignment['ConsignorId']])->fetch();
        $consignment['Consignee'] = $this->db->query("SELECT * FROM consignees WHERE Id = ?", [$consignment['ConsigneeId']])->fetch();
        $consignment['FromCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$consignment['FromCityId']])->fetch();
        $consignment['ToCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$consignment['ToCityId']])->fetch();
        return $consignment;
    }
}
