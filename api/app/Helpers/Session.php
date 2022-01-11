<?php
namespace Helpers;

class Session
{
    static function start()
    {
        session_start();
    }

    static function set(string $key, $value)
    {
        $_SESSION[$key] = $value;
    }

    static function get(string $key)
    {
        return $_SESSION[$key];
    }

    static function remove(string $key)
    {
        unset($_SESSION[$key]);
    }

    static function pull(string $key)
    {
        $result = $_SESSION[$key];
        unset($_SESSION[$key]);
        return $result;
    }

    static function end()
    {
        session_regenerate_id(true);
    }
}