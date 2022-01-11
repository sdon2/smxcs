<?php

namespace Controllers;

use Helpers\TextLocal;
use Helpers\DB;

class Test
{
    public function __construct()
    {
        $this->db = new DB(DB_HOST, DB_NAME, DB_USER, DB_PASSWORD);
        $this->sms = new TextLocal(null, null, SMS_API_KEY);
    }

    public function getIndex()
    {
        $lr_number = \str_pad(11196, 5, '0', STR_PAD_LEFT);;
        $query = "SELECT c1.Name AS consignor, c1.Mobile as consignor_mobile, c2.Name as consignee, c2.Mobile as consignee_mobile FROM consignments c JOIN consignors c1 ON c1.Id=c.ConsignorId JOIN consignees c2 ON c2.Id=c.ConsigneeId WHERE c.Id=11222";
        $data = $this->db->query($query)->fetch();

        $consignee = \strtoupper(\substr($data['consignor'], 0, 24));
        $consignor = \strtoupper(\substr($data['consignee'], 0, 24));
        $noOfItems = 4;
        $items = ($noOfItems <= 1) ? "1 item" : ($noOfItems . " items");

        // Send sms to consignor
        $message = \str_ireplace(['{items}', '{consignment_no}', '{party}'], [$items, $lr_number, $consignee], CONSIGNOR_SMS_FORMAT);
        $result = $this->_sendSms($data['consignor_mobile'], $message);
        print_r($result);

        // Send sms to consignee
        $message = \str_ireplace(['{items}', '{consignment_no}', '{party}'], [$items, $lr_number, $consignor], CONSIGNEE_SMS_FORMAT);
        $result = $this->_sendSms($data['consignee_mobile'], $message);
        print_r($result);
    }

    /** @noinspection DuplicatedCode */
    private function _sendSms(string $to, string $message) {

        var_dump($message);
        $result = $this->sms->sendSms(['91' . $to], $message, SMS_SENDER, null, true);
        if ($result) {
            $error = $result->errors ? $result->errors[0]->message : null;
            $sql = "INSERT INTO sms_logs (`status`, error, mobilenumbers, msgcount, senttime) VALUES (?, ?, ?, ?, now())";
            $this->db->insert($sql, [$result->status, $error, $to, $result->cost ?? 0]);
        }

        $balance = $this->sms->getBalance();
        print_r($balance);
        return $result;
    }
}
