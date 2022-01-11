<?php
namespace Controllers;

use Classes\ConsignmentSearch;
use Exceptions\ApiException;

class Consignments extends AuthController
{
    private $consignor;
    private $consignee;

    function getIndex()
    {
        $offset = $this->get("offset") ?: 0;
        $limit = $this->get("limit") ?: 100;
        $sql = "SELECT * FROM consignments";
        if ($this->isBranch()) $sql .= " WHERE `Status` != 1";
        $sql .= " ORDER BY ConsignmentDate DESC, Id DESC LIMIT ? OFFSET ?";
        $consignments = $this->db->query($sql, [$limit, $offset])->fetchAll() ?: [];
        foreach ($consignments as &$consignment)
            $this->populateSubItems($consignment);
        $this->setData($consignments);
        $this->render();
    }

    function populateSubItems(&$consignment) {
        $consignment['Consignor'] = $this->db->query("SELECT * FROM consignors WHERE Id = ?", [$consignment['ConsignorId']])->fetch();
        $consignment['Consignee'] = $this->db->query("SELECT * FROM consignees WHERE Id = ?", [$consignment['ConsigneeId']])->fetch();
        $consignment['FromCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$consignment['FromCityId']])->fetch();
        $consignment['ToCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$consignment['ToCityId']])->fetch();
    }

    function getStats() {
        $sql = "SELECT COUNT(Id) as totalItems FROM consignments";
        $result = $this->db->query($sql)->fetch();

        $this->setData($result);
        $this->render();
    }

    function getFind($id)
    {
        $sql = "SELECT * FROM consignments WHERE Id = ?";
        if ($this->isBranch()) $sql .= " AND `Status` != 1";
        $consignment = $this->db->query($sql, [$id])->fetch();
        if (!$consignment) $this->throwError("Consignment not found");

        $this->populateSubItems($consignment);

        $this->setData($consignment);
        $this->render();
    }

    function postSearch()
    {
        $text = $this->jsonPost("text");
        if (!$text) {
            $this->throwError("Search text not found");
        }

        $sql = <<<SQL
SELECT consignments.* FROM consignments
JOIN consignors ON consignments.ConsignorId = consignors.Id
JOIN consignees ON consignments.ConsigneeId = consignees.Id
WHERE (consignments.LRNumber = ?  OR consignors.Name LIKE ? OR consignees.Name LIKE ?)
SQL;
        if ($this->isBranch()) $sql .= " AND consignments.`Status` != 1";
        $sql .= " ORDER BY consignments.ConsignmentDate DESC, consignments.Id DESC";
        $consignments = $this->db->query($sql, [$text, $text."%", $text."%"])->fetchAll() ?: [];
        foreach($consignments as &$consignment)
            $this->populateSubItems($consignment);
        $this->setData($consignments);
        $this->render();
    }

    function postAdvancedSearch()
    {
        $params = $this->jsonPost();
        if (!in_array($params['customerType'], ['consignor', 'consignee'])) {
            $this->throwError('Invalid search type');
        }
        $searchParams['customerType'] = $params['customerType'];
        $searchParams['paymentMode'] = $params['paymentMode'];
        $searchParams['searchId'] = $params['searchText']['Id'];
        $searchParams['startDate'] = $this->convertToMysqlDate($params['startDate']);
        $searchParams['endDate'] = $this->convertToMysqlDate($params['endDate']);
        $searchParams['pageIndex'] = $params['pageIndex'];
        $searchParams['pageSize'] = $params['pageSize'];
        $searchParams['offset'] = ($searchParams['pageIndex'] - 1) * $searchParams['pageSize'];
        $searchParams['limit'] = $params['pageSize'];
        $pageStats = [];
        $advanced_search = new ConsignmentSearch();
        $consignments = $advanced_search->normalSearch($searchParams, $pageStats);
        $this->setData(['searchParams' => $searchParams, 'result' => $consignments, 'pageStats' => $pageStats]);
        $this->render();
    }

    function getUncompleted()
    {
        $sql = "SELECT * FROM consignments WHERE ISNULL(OGP_Id) AND `Status` = ? AND FinancialYear=" . $_ENV['FINANCIAL_YEAR'];
        $consignments = $this->db->query($sql, [NEWCONSIGNMENT])->fetchAll() ?: [];

        foreach($consignments as &$consignment)
            $this->populateSubItems($consignment);

        $this->setData($consignments);
        $this->render();
    }

    function preparePostData(&$postData) {
        // Format javascript date to mysql datetime
        $postData['ConsignmentDate'] = $this->convertToMysqlDate($postData['ConsignmentDate']);

        if (\is_array($postData['FromCity'])) {
            $postData['FromCityId'] = $postData['FromCity']['Id'];
        } else $this->throwError('Invalid from city specified');

        if (\is_array($postData['ToCity'])) {
            $postData['ToCityId'] = $postData['ToCity']['Id'];
        } else $this->throwError('Invalid to city specified');

        if (\is_array($postData['Consignor'])) {
            $postData['ConsignorId'] = $postData['Consignor']['Id'];
            $this->consignor = $postData['Consignor'];
        } else $this->throwError('Invalid consignor specified');

        if (\is_array($postData['Consignee'])) {
            $postData['ConsigneeId'] = $postData['Consignee']['Id'];
            $this->consignee = $postData['Consignee'];
        } else $this->throwError('Invalid consignee specified');
    }

    function postCreate()
    {
        $postData = $this->jsonPost();

        $this->preparePostData($postData);

        $s_params = "ConsignmentDate,LRNumber,ConsignorId,ConsigneeId,FromCityId,ToCityId,NoOfItems,Description,ChargedWeightKgs,FreightCharge,DeliveryCharges,LoadingCharges,UnloadingCharges,Demurrage,GSTPercent,GSTAmount,InvoiceNumber,PaymentMode,FinancialYear";
        $s_params_exploded = explode(",", $s_params);
        $q_params = implode(",", \array_fill(0, count($s_params_exploded), "?"));
        $sql = "INSERT INTO consignments ({$s_params}) VALUES({$q_params})";
        $params = [];
        foreach ($s_params_exploded as $param) {
            if ($param === 'FinancialYear') {
                \array_push($params, $_ENV['FINANCIAL_YEAR']);
            } else {
                \array_push($params, $postData[$param]);
            }
        }
        $id = $this->db->insert($sql, $params);
        if (!$id) $this->throwError("Unable to add consignment");

        if ($this->consignor && $this->consignee) {
            $lr_number = \str_pad($postData['LRNumber'], 5, '0', STR_PAD_LEFT);
            $consignee = \strtoupper(\substr($this->consignee['Name'], 0, 24));
            $consignor = \strtoupper(\substr($this->consignor['Name'], 0, 24));
            $noOfItems = $postData['NoOfItems'];
            $items = ($noOfItems <= 1) ? "1 item" : ($noOfItems . " items");

            // Send sms to consignor
            if (isset($this->consignor['Mobile']) && !empty($this->consignor['Mobile']) && \strlen($this->consignor['Mobile']) == 10) {
                $message = \str_ireplace(['{items}', '{consignment_no}', '{party}'], [$items, $lr_number, $consignee], CONSIGNOR_SMS_FORMAT);
                $this->_sendSms($this->consignor['Mobile'], $message);
            }

            // Send sms to consignee
            if (isset($this->consignee['Mobile']) && !empty($this->consignee['Mobile']) && \strlen($this->consignee['Mobile']) == 10) {
                $message = \str_ireplace(['{items}', '{consignment_no}', '{party}'], [$items, $lr_number, $consignor], CONSIGNEE_SMS_FORMAT);
                $this->_sendSms($this->consignee['Mobile'], $message);
            }
        }

        $this->logger->consignmentLog($id, "booked");

        $this->setData($id);
        $this->setMessage("Success");
        $this->render();
    }

    function postUpdate()
    {
        $postData = $this->jsonPost();
        $id = $postData['Id'];

        $sql = "SELECT Id FROM consignments WHERE NOT ISNULL(Bill_Id) AND Id = ?";
        if (sizeof($this->db->query($sql, [$id])->fetchAll()) > 0) {
            throw new ApiException("Cannot modify billed consignment");
        }

        $this->preparePostData($postData);

        $s_params = "ConsignmentDate,LRNumber,ConsignorId,ConsigneeId,FromCityId,ToCityId,NoOfItems,Description,ChargedWeightKgs,FreightCharge,DeliveryCharges,LoadingCharges,UnloadingCharges,Demurrage,GSTPercent,GSTAmount,InvoiceNumber,PaymentMode";
        $s_params_exploded = explode(",", $s_params);
        // For concatinating ? to the end of each coloumn name
        $s_params_exploded_1 = $s_params_exploded;
        \array_walk($s_params_exploded_1, function (&$item) {
            $item = "{$item} = ?";
        });
        $q_params = implode(",", $s_params_exploded_1);
        $sql = "UPDATE consignments SET {$q_params} WHERE Id = ?";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        // Finally push id
        \array_push($params, $id);

        // Update consignment
        $count = $this->db->update($sql, $params);

        if ($count) {
            $this->logger->consignmentLog($id, "updated");
        }

        $this->setMessage("Success");
        $this->render();
    }

    function postUpdateStatus()
    {
        $postData = $this->jsonPost();
        if (!isset($postData['id']) || !isset($postData['status']))
            $this->throwError("Invalid id or status specified");

        $id = $postData['id'];
        $status = $postData['status'];

        $sql = "UPDATE consignments SET `Status` = ? WHERE Id = ?";
        $result = $this->db->update($sql, [$status, $id]);

        if ($result) {
            $this->logger->consignmentLog($id, "status changed to '" . STATUSES[$status] . "'");
        }

        $this->setData($result);
        $this->render();
    }

    function postDelete()
    {
        $id = intval($this->jsonPost("id"));
        $sql = "DELETE FROM consignments WHERE Id = ?";
        $this->db->delete($sql, [$id]);

        $this->setMessage("Success");
        $this->render();
    }

    function getNewLrId()
    {
        $sql = "SELECT MAX(LRNumber) AS NewLR FROM consignments WHERE FinancialYear=" . $_ENV['FINANCIAL_YEAR'];
        $result = $this->db->query($sql)->fetch();
        $result = ($result['NewLR'] ?: 0) + 1;

        // Result contains 'NewLR'
        $this->setData($result);
        $this->render();
    }

    /** @noinspection DuplicatedCode */
    private function _sendSms(string $to, string $message) {
        if (empty($to) || empty($message)) {
            $this->throwError('Mobile number and Message is required');
        }

        if (!preg_match('/^\d{10}$/', $to) || preg_match('/^[01234].*/', $to)) {
            return;
        }

        $result = $this->sms->sendSms([ '91' . $to ], $message, SMS_SENDER, null, DEVELOPMENT);
        if ($result) {
            $error = $result->errors ? $result->errors[0]->message : null;
            $sql = "INSERT INTO sms_logs (`status`, error, mobilenumbers, msgcount, senttime) VALUES (?, ?, ?, ?, now())";
            $this->db->insert($sql, [$result->status, $error, $to, $result->cost ?? 0]);
        }

        $balance = $this->sms->getBalance();
        if ($balance) {
            $this->options->setOption(OPT_REMAINING_SMS, (string)$balance['sms']);
        }
    }

    private function log($message) {
      \file_put_contents(API_PATH . '/logs/sms.log', $message. PHP_EOL, FILE_APPEND);
    }
 }
