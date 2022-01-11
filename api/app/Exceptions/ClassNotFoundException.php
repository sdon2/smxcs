<?php namespace Exceptions;

class ClassNotFoundException extends \Exception
{
    function __construct($className)
    {
        parent::__construct("Class not found: {$className}", 404);
    }
}