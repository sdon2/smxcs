<?php namespace Controllers;

use Exceptions\ApiException;

class ConsignmentLogs extends AuthController
{
    private $selectSql = <<<SQL
SELECT cl.Id, cl.LogDate, u.Fullname AS User, c.LRNumber, cl.`Message`
FROM consignment_logs cl
LEFT JOIN users u ON u.Id = cl.UserId
LEFT JOIN consignments c ON c.Id = cl.ConsignmentId
SQL;

    function getIndex()
    {
        $offset = $this->get("offset") ?: 0;
        $limit = $this->get("limit") ?: 100;
        $sql = $this->selectSql;
        if ($this->isAccountant() || $this->isBranch()) {
            $sql .= " WHERE cl.UserId = " . $this->userdata->id;
        }
        $sql .= " ORDER BY c.LRNumber DESC, cl.Id DESC LIMIT ? OFFSET ?";
        $logs = $this->db->query($sql, [$limit, $offset])->fetchAll() ?: [];

        $this->setData($logs);
        $this->render();
    }

    function getStats() {
        $sql = "SELECT COUNT(Id) as totalItems FROM consignment_logs";
        if ($this->isAccountant() || $this->isBranch()) {
            $sql .= " WHERE consignment_logs.UserId = " . $this->userdata->id;
        }
        $result = $this->db->query($sql)->fetch();

        $this->setData($result);
        $this->render();
    }

    function postSearch()
    {
        $text = $this->jsonPost("text");
        if (!$text) {
            $this->throwError("Search text not found");
        }
        
        $sql = $this->selectSql;
        $sql .= " WHERE c.LRNumber = ?";

        if ($this->isAccountant() || $this->isBranch()) {
            $sql .= " AND cl.UserId = " . $this->userdata->id;
        }
        $sql .= " ORDER BY c.LRNumber DESC, cl.Id DESC";
        $logs = $this->db->query($sql, [$text])->fetchAll() ?: [];

        $this->setData($logs);
        $this->render();
    }
 }