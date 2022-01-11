<?php

namespace Controllers;

use Exceptions\ApiException;

class Settings extends AuthController
{
  function postSearch()
  {
    $optionName = $this->jsonPost('name') ?: null;
    $sql = "SELECT `Value` FROM options WHERE `Option` = ?";
    $option = $this->db->query($sql, [$optionName])->fetch();

    if ($option) $option = \json_decode($option['Value'], true);
    $this->setData($option);
    $this->render();
  }

  function postSave()
  {
    $postData = $this->jsonPost();
    $optionName = $postData['name'] ?: null;
    if (!$optionName)
      throw new ApiException("Unknown option");
    $data = $postData['data'] ?: null;
    $data = \json_encode($data);
    $sql = "INSERT INTO options (`Option`, `Value`) VALUES(?, ?) ON DUPLICATE KEY UPDATE `Value` = ?";
    $result = $this->db->insert($sql, [$optionName, $data, $data]);
    if ($result) $this->setData($result);
    else $this->throwError("Cannot save option");
    $this->render();
  }
}
