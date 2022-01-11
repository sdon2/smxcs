<?php namespace Helpers;

use Helpers\JWT\JWT;

class JwtHelper
{
  static $key = "}e-!7YZwg!";

  static function decode($token) {
    return JWT::decode($token, \base64_decode(\strtr(JwtHelper::$key, '-_', '+/')), ['HS256']);
  }

  static function encode($payload) {
    return JWT::encode($payload, \base64_decode(\strtr(JwtHelper::$key, '-_', '+/')), 'HS256');
  }
}