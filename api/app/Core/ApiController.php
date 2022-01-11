<?php namespace Core;

use Helpers\DB;
use Helpers\TextLocal;
use Helpers\Options;
use Exceptions\ApiException;

abstract class ApiController
{
    /**
     * @var ApiResult
     */
    private $result;

    /**
     * @var \Helpers\DB
     */
    protected $db;

    /**
     * @var \Core\Logger
     */
    protected $logger;

    /**
     * @var \Helpers\TextLocal
     */
    protected $sms;

    /**
     * @var \Helpers\Options
     */
    protected $options;

    function __construct()
    {
        $this->result = new ApiResult();
        $this->db = new DB(DB_HOST, DB_NAME, DB_USER, DB_PASSWORD);
        $this->sms = new TextLocal(null, null, SMS_API_KEY);
        $this->logger = new Logger();
        $this->logger->setDatabaseConnection($this->db);
        $this->options = new Options();
        $this->options->setDatabaseConnection($this->db);
    }

    function post(string $paramName = null)
    {
        if ($paramName == null) return $_POST;
        return $_POST[$paramName];
    }

    function jsonPost(string $paramName = null) {
        $data = \json_decode(\file_get_contents('php://input'), true);
        if ($paramName == null) return $data;
        return $data[$paramName];
    }

    function get(string $paramName = null)
    {
        if ($paramName == null) return $_GET;
        return $_GET[$paramName];
    }

    function throwError($message = "Unknown error") {
        throw new ApiException($message);
    }

    function setError(string $errorMessage, int $statusCode = 500)
    {
        $this->result->setStatus($statusCode);
        $this->result->setError($errorMessage);
    }

    function setMessage(string $message)
    {
        $this->result->setStatus(200);
        $this->result->setMessage($message);
    }

    function setData($data, string $message = null)
    {
        if ($message == null) $message = "Success";
        $this->result->setStatus(200);
        $this->result->setMessage($message);
        $this->result->setData($data);
    }

    function render()
    {
        echo $this->result;
    }
}
