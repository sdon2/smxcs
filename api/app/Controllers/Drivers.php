<?php namespace Controllers;

use Exceptions\ApiException;

class Drivers extends AuthController
{
    function getIndex()
    {
        $sql = "SELECT * FROM drivers";
        $drivers = $this->db->query($sql)->fetchAll() ?: [];

        $this->setData($drivers);
        $this->render();
    }

    function postCreate()
    {
        $sql = "INSERT INTO drivers (DriverName,DriverPhone) VALUES(?,?)";
        $result = $this->db->insert($sql, [\strtoupper($this->jsonPost('DriverName')),$this->jsonPost('DriverPhone')]);
        if ($result) $this->setData($result);
        else $this->throwError("Cannot save driver");
        $this->render();
    }
 }