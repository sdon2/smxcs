<?php namespace Exceptions;

class ApiException extends \Exception
{
    function __construct($message = "Unknown error")
    {
        parent::__construct($message, 500);
    }
}