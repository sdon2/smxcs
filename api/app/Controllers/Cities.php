<?php namespace Controllers;

use Exceptions\ApiException;

class Cities extends AuthController
{
    function getIndex()
    {
        $sql = "SELECT * FROM cities";
        $cities = $this->db->query($sql)->fetchAll() ?: [];

        $this->setData($cities);
        $this->render();
    }

    function postCreate()
    {
        $sql = "INSERT INTO cities (CityName) VALUES(?)";
        $result = $this->db->insert($sql, [$this->jsonPost('CityName')]);
        if ($result) $this->setData($result);
        else $this->setError("Cannot save city");
        $this->render();
    }
 }