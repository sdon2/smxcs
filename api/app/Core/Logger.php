<?php namespace Core;

class Logger
{
    private $db;
    private $user_id;

    function setUserId($user_id) {
        $this->user_id = $user_id;
    }

    function setDatabaseConnection($db) {
        $this->db = $db;
    }

    function consignmentLog(int $consignment_id, string $message) {
        if ($this->user_id && $this->user_id != 1) {
            $sql = "INSERT INTO consignment_logs (ConsignmentId, UserId, `Message`) VALUES (?, ?, ?)";
            $values = [$consignment_id, $this->user_id, $message];
            $this->db->insert($sql, $values);
        }
    }

    function billingLog(int $bill_id, string $consignment_ids, string $message) {
        if ($this->user_id && $this->user_id != 1) {
            $sql = "INSERT INTO billing_logs (Billing_Id, ConsignmentIds, UserId, `Message`) VALUES (?, ?, ?, ?)";
            $values = [$bill_id, $consignment_ids, $this->user_id, $message];
            $this->db->insert($sql, $values);
        }
    }
}