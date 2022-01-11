<?php namespace Controllers;

use Exceptions\ApiException;

class Ogplists extends AuthController
{
    function getIndex()
    {
        $offset = $this->get("offset") ?: 0;
        $limit = $this->get("limit") ?: 100;
        $sql = "SELECT * FROM ogplists ORDER BY OGPListDate DESC, Id DESC LIMIT ? OFFSET ?";
        $ogplists = $this->db->query($sql, [$limit, $offset])->fetchAll() ?: [];

        foreach ($ogplists as &$ogplist) {
            $count = $this->db->query("SELECT COUNT(Id) AS ccount, SUM(NoOfItems) as sitems FROM consignments WHERE OGP_Id = ?", [$ogplist['Id']])->fetch();
            $ccount = $count ? $count['ccount'] : 0;
            $ogplist['NoOfConsignments'] = $ccount;
            $icount = $count ? $count['sitems'] : 0;
            $ogplist['NoOfItems'] = $icount;

            $ogplist['Vehicle'] = $this->db->query('SELECT * FROM vehicles WHERE Id = ?', [$ogplist['VehicleId']])->fetch();
            $ogplist['Driver'] = $this->db->query('SELECT * FROM drivers WHERE Id = ?', [$ogplist['DriverId']])->fetch();
            $ogplist['FromCity'] = $this->db->query('SELECT * FROM cities WHERE Id = ?', [$ogplist['FromCityId']])->fetch();
            $ogplist['ToCity'] = $this->db->query('SELECT * FROM cities WHERE Id = ?', [$ogplist['ToCityId']])->fetch();
        }

        $this->setData($ogplists);
        $this->render();
    }

    function getStats() {
        $sql = "SELECT COUNT(Id) as totalItems FROM ogplists";
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

        $sql = <<<SQL
SELECT ogplists.* FROM ogplists JOIN consignments ON ogplists.Id = consignments.OGP_Id
JOIN consignors ON consignments.ConsignorId = consignors.Id
WHERE consignments.LRNumber = ? OR consignors.Name LIKE ?
ORDER BY ogplists.OGPListDate DESC, ogplists.Id DESC
SQL;
        $ogplists = $this->db->query($sql, [$text, $text."%"])->fetchAll() ?: [];

        foreach ($ogplists as &$ogplist) {
            $count = $this->db->query("SELECT COUNT(Id) AS ccount FROM consignments WHERE OGP_Id = ?", [$ogplist['Id']])->fetch();
            $count = $count ? $count['ccount'] : 0;
            $ogplist['NoOfConsignments'] = $count;

            $ogplist['Vehicle'] = $this->db->query('SELECT * FROM vehicles WHERE Id = ?', [$ogplist['VehicleId']])->fetch();
            $ogplist['Driver'] = $this->db->query('SELECT * FROM drivers WHERE Id = ?', [$ogplist['DriverId']])->fetch();
            $ogplist['FromCity'] = $this->db->query('SELECT * FROM cities WHERE Id = ?', [$ogplist['FromCityId']])->fetch();
            $ogplist['ToCity'] = $this->db->query('SELECT * FROM cities WHERE Id = ?', [$ogplist['ToCityId']])->fetch();
        }

        $this->setData($ogplists);
        $this->render();
    }

    function getFind($id)
    {
        $sql = "SELECT * FROM ogplists WHERE Id = ?";
        $ogplist = $this->db->query($sql, [$id])->fetch();
        if (!$ogplist) $this->throwError("OGP List not found");

        $ogplist['Vehicle'] = $this->db->query("SELECT * FROM vehicles WHERE Id = ?", [$ogplist['VehicleId']])->fetch();
        $ogplist['FromCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$ogplist['FromCityId']])->fetch();
        $ogplist['ToCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$ogplist['ToCityId']])->fetch();

        $i_sql = "SELECT * FROM consignments WHERE OGP_Id = ?";
        $ogplist['Consignments'] = $this->db->query($i_sql, [ $ogplist['Id'] ])->fetchAll() ?: [];
        foreach ($ogplist['Consignments'] as &$consignment) {
            $consignment['FromCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$consignment['FromCityId']])->fetch();
            $consignment['ToCity'] = $this->db->query("SELECT * FROM cities WHERE Id = ?", [$consignment['ToCityId']])->fetch();
            $consignment['Consignor'] = $this->db->query("SELECT * FROM consignors WHERE Id = ?", [$consignment['ConsignorId']])->fetch();
            $consignment['Consignee'] = $this->db->query("SELECT * FROM consignees WHERE Id = ?", [$consignment['ConsigneeId']])->fetch();
        }
        $driver = $this->db->query("SELECT * FROM drivers WHERE Id = ?", [$ogplist['DriverId']])->fetch();
        $ogplist['Driver'] = $driver;

        $this->setData($ogplist);
        $this->render();
    }

    function postCreate()
    {
        $postData = $this->jsonPost();


        if (\is_array($postData['Driver'])) {
            $postData['DriverName'] = $postData['Driver']['DriverName'];
        } else {
            $postData['DriverName'] = $postData['Driver'];
        }

        // Generate driver from input
        $driverName = \trim($postData['DriverName']);
        $driverPhone =\trim($postData['DriverPhone']);

        $postData['DriverId'] = 0;
        // Check driver exists
        $driver = $this->db->query("SELECT Id FROM drivers WHERE DriverName = ? AND DriverPhone = ?", [$driverName, $driverPhone])->fetch();
        if (!$driver) {
            $postData['DriverId'] = $this->db->insert("INSERT INTO drivers (DriverName, DriverPhone) VALUES (?,?)", [$driverName, $driverPhone]);
        }
        else {
            $postData['DriverId'] = $driver['Id'];
        }

        if (\is_array($postData['FromCity'])) {
            $postData['FromCityId'] = $postData['FromCity']['Id'];
        } else $this->throwError('Invalid from city specified');

        if (\is_array($postData['ToCity'])) {
            $postData['ToCityId'] = $postData['ToCity']['Id'];
        } else $this->throwError('Invalid to city specified');

        if (\is_array($postData['Vehicle'])) {
            $postData['VehicleId'] = $postData['Vehicle']['Id'];
        } else $this->throwError('Invalid vehicle specified');

        $postData['OGPListDate'] = $this->convertToMysqlDate($postData['OGPListDate']);

        $s_params = "OGPListDate,FromCityId,ToCityId,VehicleId,DriverId,Rent,Advance";
        $s_params_exploded = explode(",", $s_params);
        $q_params = implode(",", \array_fill(0, count($s_params_exploded), "?"));
        $sql = "INSERT INTO ogplists ({$s_params}) VALUES({$q_params})";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        // Get id for item relationship
        $c_id = $this->db->insert($sql, $params);
        if (!$c_id) $this->throwError("Unable to add ogplist");

        // Start adding items
        $items = $postData['Consignments'];
        $i_sql = "UPDATE consignments SET OGP_Id = ?, `Status` = ? WHERE Id = ?";
        foreach ($items as $item) {
            $ci_id = $this->db->update($i_sql, [$c_id, ONTRANSIT, $item['Id']]);
            if (!$ci_id) $this->throwError("Unable to add consignment");
            $this->logger->consignmentLog($item['Id'], "status changed to: '" . STATUSES[ONTRANSIT] . "'. ogp list #" . $c_id);
        }

        $this->setMessage("Success");
        $this->render();
    }

    function postUpdate()
    {
        $postData = $this->jsonPost();
        $id = $postData['Id'];

        if (\is_array($postData['Driver'])) {
            $postData['DriverName'] = $postData['Driver']['DriverName'];
        } else {
            $postData['DriverName'] = $postData['Driver'];
        }

        // Generate driver from input
        $driverName = \trim($postData['DriverName']);
        $driverPhone =\trim($postData['DriverPhone']);

        $postData['DriverId'] = 0;
        // Check driver exists
        $driver = $this->db->query("SELECT Id FROM drivers WHERE DriverName = ? AND DriverPhone = ?", [$driverName, $driverPhone])->fetch();
        if (!$driver) {
            $postData['DriverId'] = $this->db->insert("INSERT INTO drivers (DriverName, DriverPhone) VALUES (?,?)", [$driverName, $driverPhone]);
        }
        else {
            $postData['DriverId'] = $driver['Id'];
        }

        if (\is_array($postData['FromCity'])) {
            $postData['FromCityId'] = $postData['FromCity']['Id'];
        } else $this->throwError('Invalid from city specified');

        if (\is_array($postData['ToCity'])) {
            $postData['ToCityId'] = $postData['ToCity']['Id'];
        } else $this->throwError('Invalid to city specified');

        if (\is_array($postData['Vehicle'])) {
            $postData['VehicleId'] = $postData['Vehicle']['Id'];
        } else $this->throwError('Invalid vehicle specified');

        $postData['OGPListDate'] = $this->convertToMysqlDate($postData['OGPListDate']);

        $s_params = "OGPListDate,FromCityId,ToCityId,VehicleId,DriverId,Rent,Advance";
        $s_params_exploded = explode(",", $s_params);
        // For concatinating ? to the end of each coloumn name
        $s_params_exploded_1 = $s_params_exploded;
        \array_walk($s_params_exploded_1, function (&$item) {
            $item = "{$item} = ?";
        });
        $q_params = implode(",", $s_params_exploded_1);
        $sql = "UPDATE ogplists SET {$q_params} WHERE Id = ?";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        // Finally push id
        \array_push($params, $id);

        // Update ogplist
        $this->db->update($sql, $params);

        $cons = $this->db->query("SELECT Id FROM consignments WHERE OGP_Id = ?", [$id])->fetchAll() ?: [];

        $keys = [];
        foreach($cons as $con) \array_push($keys, $con['Id']);

        $iKeys = [];
        foreach ($postData['Consignments'] as $item) \array_push($iKeys, $item['Id']);

        $diff = \array_diff($iKeys, $keys);

        $message = null;
        $sql = "UPDATE consignments SET OGP_Id = ?, `Status` = ? WHERE Id = ?";
        foreach($diff as $d) {
            if (!$this->db->update($sql, [$id, ONTRANSIT, $d])) continue;
            $message = "status changed to: '" . STATUSES[ONTRANSIT] . "'. ogp list #" . $id;
            $this->logger->consignmentLog($d, $message);
        }

        $diff2 = \array_diff($keys, $iKeys);
        foreach($diff2 as $d2) {
            if (!$this->db->update($sql, [null, NEWCONSIGNMENT, $d2])) continue;
            $message = "status changed back to: '" . STATUSES[NEWCONSIGNMENT] . "'. removed from ogp list #" . $id;
            $this->logger->consignmentLog($d2, $message);
        }

        $this->setMessage("Success");
        $this->render();
    }

    function postDelete()
    {
        $id = intval($this->jsonPost("id"));
        $cons = $this->db->query("SELECT Id FROM consignments WHERE OGP_Id = ?", [$id])->fetchAll();
        
        $sql = "DELETE FROM ogplists WHERE Id = ?";
        $deleted = $this->db->delete($sql, [$id]);

        if ($deleted && $cons) {
            foreach ($cons as $con) {
                $this->db->update("UPDATE consignments SET `Status` = ? WHERE Id = ?", [NEWCONSIGNMENT, $con['Id']]);
                $this->logger->consignmentLog($con['Id'], "status changed back to: '" . STATUSES[NEWCONSIGNMENT] . "'. removed from ogp list #" . $id);
            }
        }

        $this->setMessage("Success");
        $this->render();
    }
 }