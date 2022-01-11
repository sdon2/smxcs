<?php namespace Exceptions;

class AuthException extends \Exception
{
    function __construct($message)
    {
        parent::__construct($message, 401);
    }
}