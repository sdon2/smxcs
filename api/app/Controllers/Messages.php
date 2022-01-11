<?php namespace Controllers;

use Exceptions\ApiException;

class Messages extends AuthController
{
    function getIndex()
    {
        $this->setData([]);
        $this->render();
    }

    function getUnreadStats()
    {
        $this->setData(['totalItems' => \rand(0, 999)]);
        $this->render();
    }

    function getStats()
    {
        $this->setData(['totalItems' => 0]);
        $this->render();
    }
 }