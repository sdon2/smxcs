<?php
namespace Controllers;

use Exceptions\ApiException;

class Consignors extends AuthController
{
    function getIndex()
    {
        $offset = $this->get("offset") ?: 0;
        $limit = $this->get("limit") ?: 100;
        $sql = "SELECT * FROM consignors ORDER BY consignors.Name ASC, Id DESC LIMIT ? OFFSET ?";
        $consignors = $this->db->query($sql, [$limit, $offset])->fetchAll() ?: [];
        $this->setData($consignors);
        $this->render();
    }

    function getStats() {
        $sql = "SELECT COUNT(Id) as totalItems FROM consignors";
        $result = $this->db->query($sql)->fetch();

        $this->setData($result);
        $this->render();
    }

    function getFind($id)
    {
        $sql = "SELECT * FROM consignors WHERE Id = ?";
        $consignor = $this->db->query($sql, [$id])->fetch();
        if (!$consignor) $this->throwError("Consignor not found");

        $this->setData($consignor);
        $this->render();
    }

    function postSearch()
    {
        $text = $this->jsonPost("text");
        if (!$text) {
            $this->throwError("Search text not found");
        }

        $sql = "SELECT * FROM consignors WHERE consignors.Name LIKE ? ORDER BY consignors.Name ASC, Id DESC";
        $consignors = $this->db->query($sql, [$text."%"])->fetchAll() ?: [];
        $this->setData($consignors);
        $this->render();
    }

    function getForConsignment() {
        $sql = "SELECT consignors.Id, consignors.Name, consignors.Mobile, consignors.FreightCharge, consignors.BasedOn, consignors.PaymentTerms FROM consignors ORDER BY consignors.Name ASC, Id DESC";
        $consignors = $this->db->query($sql)->fetchAll() ?: [];
        $this->setData($consignors);
        $this->render();
    }

    function postCreate()
    {
        $postData = $this->jsonPost();

        $s_params = "Name,Address,Address1,City,State,Pincode,Mobile,GSTNo,FreightCharge,BasedOn,PaymentTerms,Remarks";
        $s_params_exploded = explode(",", $s_params);
        $q_params = implode(",", \array_fill(0, count($s_params_exploded), "?"));
        $sql = "INSERT INTO consignors ({$s_params}) VALUES({$q_params})";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        $id = $this->db->insert($sql, $params);
        if (!$id) $this->throwError("Unable to add consignor");

        $this->setData($id);
        $this->setMessage("Success");
        $this->render();
    }

    function postUpdate()
    {
        $postData = $this->jsonPost();
        $id = $postData['Id'];

        $s_params = "Name,Address,Address1,City,State,Pincode,Mobile,GSTNo,FreightCharge,BasedOn,PaymentTerms,Remarks";
        $s_params_exploded = explode(",", $s_params);
        // For concatinating ? to the end of each coloumn name
        $s_params_exploded_1 = $s_params_exploded;
        \array_walk($s_params_exploded_1, function (&$item) {
            $item = "{$item} = ?";
        });
        $q_params = implode(",", $s_params_exploded_1);
        $sql = "UPDATE consignors SET {$q_params} WHERE Id = ?";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        // Finally push id
        \array_push($params, $id);

        // Update consignor
        $this->db->update($sql, $params);

        $this->setMessage("Success");
        $this->render();
    }

    function postDelete()
    {
        $id = intval($this->jsonPost("id"));
        $sql = "SELECT Id FROM bills WHERE PartyType = 'consignor' AND PartyId = ?";
        if (sizeof($this->db->query($sql, [$id])->fetchAll()) > 0) {
            throw new ApiException("Cannot delete a billed consignor");
        }
        $sql = "DELETE FROM consignors WHERE Id = ?";
        $this->db->delete($sql, [$id]);

        $this->setMessage("Success");
        $this->render();
    }
 }
