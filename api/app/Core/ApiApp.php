<?php namespace Core;

class ApiApp
{
    function __construct()
    {
        if (!\defined('DEVELOPMENT')) {
            \define('DEVELOPMENT', false);
        }

        // Set headers with cors
        \header("Content-Type: application/json");

        if (DEVELOPMENT) {
            \header("Access-Control-Allow-Origin: http://localhost:4200");
            \header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            \header("Access-Control-Allow-Headers: *");
        }
    }

    function run()
    {
        Router::dispatch();
    }

    function registerErrorHandlers()
    {
        \set_exception_handler(array($this, "handleException"));
    }

    function sendErrorResponse($error, $code)
    {
        $result = array('status' => $code, 'error' => $error);
        echo \json_encode($result);
    }

    function handleException($ex)
    {
        $num = $ex->getCode();
        $str = $ex->getMessage();
        $file = $ex->getFile();
        $line = $ex->getLine();
        $time = \date("d-m-Y h:i:s A");

        if (DEVELOPMENT) {
            $error = "[{$time}] [{$num}] Error: {$str}; File: {$file}; Line: {$line};";
        }
        else {
            $error = "Application error occurred. Please contact 'SVP INFOTECH' to rectify this error.";
        }
        $this->sendErrorResponse($error, 500);

        if (!DEVELOPMENT && !$ex instanceof \Exceptions\ApiException && !\in_array($num, array(401, 404))) {
			$error = "[{$time}] [{$num}] Error: {$str}; File: {$file}; Line: {$line};";
            $log_dir = API_PATH . "/logs";
            if (!(\file_exists($log_dir) && \is_dir($log_dir))) {
                \mkdir($log_dir);
            }
            \file_put_contents("$log_dir/exceptions.log", $error . PHP_EOL, FILE_APPEND);
        }

        exit();
    }
}
