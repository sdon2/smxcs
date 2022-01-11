<?php namespace Controllers;

use Exceptions\ApiException;

class Vehicles extends AuthController
{
    function getIndex()
    {
        $sql = "SELECT * FROM vehicles";
        $vehicles = $this->db->query($sql)->fetchAll() ?: [];

        $this->setData($vehicles);
        $this->render();
    }

    function postCreate()
    {
        $sql = "INSERT INTO vehicles (RegNumber) VALUES(?)";
        $result = $this->db->insert($sql, [\strtoupper($this->jsonPost('RegNumber'))]);
        if ($result) $this->setData($result);
        else $this->throwError("Cannot save driver");
        $this->render();
    }
 }