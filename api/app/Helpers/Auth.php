<?php namespace Helpers;

class Auth 
{
  static function getRole($token) {
    $data = JwtHelper::decode($token);
    return $data->role;
  }

  static function getUserData($token) {
    return JwtHelper::decode($token);
  }

  static function isBranch($token) {
    return Auth::getRole($token) == BRANCH;
  }

  static function isAccountant($token) {
    return Auth::getRole($token) == ACCOUNTANT;
  }

  static function isOwner($token) {
    return Auth::getRole($token) == OWNER;
  }

  static function isAdmin($token) {
    return Auth::getRole($token) == ADMIN;
  }

  static function generateToken($payload_array = []) {
    return JwtHelper::encode($payload_array);
  }

  static function getAuthHeaders()
  {
    $headers = \apache_request_headers();
      if (!isset($headers['Authorization']) || empty($headers['Authorization'])) {
          throw new \Exception("Auth headers not found");
      }
      $jwt = str_replace("Bearer ", "", $headers['Authorization']);
      return $jwt;
  }
}