<?php namespace Controllers;

use Helpers\Auth;
use Core\Logger;

abstract class AuthController extends BaseController
{
  public $userdata;

  protected $jwt;

  function __construct() {
    parent::__construct();
    try {
      $this->jwt = Auth::getAuthHeaders();
      if (!$this->isBranch() && !$this->isAccountant() && !$this->isOwner() && !$this->isAdmin())
        throw new \Exception("Unauthorized");

      $this->userdata = $this->userData();

      if (!\property_exists($this->userdata, 'id'))
        throw new \Exception("Unauthorized");
      
      $this->logger->setUserId($this->userdata->id);
    }
    catch (\Exception $ex) {
      $this->setError("Unauthorized", 401);
      $this->render();
      die();
    }
  }

  function isBranch() {
    return Auth::isBranch($this->jwt);
  }

  function isAccountant() {
    return Auth::isAccountant($this->jwt);
  }

  function isOwner() {
    return Auth::isOwner($this->jwt);
  }

  function isAdmin() {
    return Auth::isAdmin($this->jwt);
  }

  private function userData() {
    return Auth::getUserData($this->jwt);
  }
}