<?php
namespace Controllers;

use Exceptions\ApiException;

class Consignees extends AuthController
{
    function getIndex()
    {
        $offset = $this->get("offset") ?: 0;
        $limit = $this->get("limit") ?: 100;
        $sql = "SELECT * FROM consignees ORDER BY consignees.Name ASC, Id DESC LIMIT ? OFFSET ?";
        $consignees = $this->db->query($sql, [$limit, $offset])->fetchAll() ?: [];
        $this->setData($consignees);
        $this->render();
    }

    function getStats() {
        $sql = "SELECT COUNT(Id) as totalItems FROM consignees";
        $result = $this->db->query($sql)->fetch();

        $this->setData($result);
        $this->render();
    }

    function getFind($id)
    {
        $sql = "SELECT * FROM consignees WHERE Id = ?";
        $consignee = $this->db->query($sql, [$id])->fetch();
        if (!$consignee) throw new ApiException("Consignee not found");

        $this->setData($consignee);
        $this->render();
    }

    function postSearch()
    {
        $text = $this->jsonPost("text");
        if (!$text) {
            $this->throwError("Search text not found");
        }

        $sql = "SELECT * FROM consignees WHERE consignees.Name LIKE ? ORDER BY consignees.Name ASC, Id DESC";
        $consignees = $this->db->query($sql, [$text."%"])->fetchAll() ?: [];
        $this->setData($consignees);
        $this->render();
    }

    function getForConsignment() {
      $sql = "SELECT consignees.Id, consignees.Name, consignees.Mobile, consignees.FreightCharge, consignees.BasedOn, consignees.PaymentTerms FROM consignees ORDER BY consignees.Name ASC, Id DESC";
        $consignees = $this->db->query($sql)->fetchAll() ?: [];
        $this->setData($consignees);
        $this->render();
    }

    function postCreate()
    {
        $postData = $this->jsonPost();

        $s_params = "Name,Address,Address1,City,State,Pincode,Mobile,GSTNo,FreightCharge,BasedOn,PaymentTerms,Remarks";
        $s_params_exploded = explode(",", $s_params);
        $q_params = implode(",", \array_fill(0, count($s_params_exploded), "?"));
        $sql = "INSERT INTO consignees ({$s_params}) VALUES({$q_params})";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        $id = $this->db->insert($sql, $params);
        if (!$id) throw new ApiException("Unable to add consignee");

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
        $sql = "UPDATE consignees SET {$q_params} WHERE Id = ?";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        // Finally push id
        \array_push($params, $id);

        // Update consignee
        $this->db->update($sql, $params);

        $this->setMessage("Success");
        $this->render();
    }

    function postDelete()
    {
        $id = intval($this->jsonPost("id"));
        $sql = "SELECT Id FROM bills WHERE PartyType = 'consignee' AND PartyId = ?";
        if (sizeof($this->db->query($sql, [$id])->fetchAll()) > 0) {
            throw new ApiException("Cannot delete a billed consignee");
        }
        $sql = "DELETE FROM consignees WHERE Id = ?";
        $this->db->delete($sql, [$id]);

        $this->setMessage("Success");
        $this->render();
    }
 }
