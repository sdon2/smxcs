<?php namespace Core;

class ApiResult
{
    private $status = 500;
    private $error = null;
    private $message = null;
    private $data = null;

    function setStatus(int $status)
    {
        $this->status = $status;
    }

    function setError(string $error)
    {
        $this->error = $error;
    }

    function setMessage(string $message)
    {
        $this->message = $message;
    }

    function setData($data)
    {
        $this->data = $data;
    }

    function __toString()
    {
        return \json_encode(array('status' => $this->status, 'data' => $this->data, 'message' => $this->message, 'error' => $this->error));
    }
}