<?php
namespace Helpers;

class Password
{
    static function hash(string $password)
    {
        return \password_hash($password, \PASSWORD_BCRYPT);
    }

    static function verify($password, $hash)
    {
        return \password_verify($password, $hash);
    }
}