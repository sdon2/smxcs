<?php namespace Exceptions;

class MethodNotFoundException extends \Exception
{
    function __construct($className, $methodName)
    {
        parent::__construct("Method '{$methodName}' not found in class: {$className}", 404);
    }
}