<?php namespace Core;

use Exceptions\ApiException;
use Exceptions\ClassNotFoundException;
use Exceptions\MethodNotFoundException;

class Router
{
    static function dispatch()
    {
        // Get request uri and parse
        $request_uri = $_SERVER['REQUEST_URI'];
        $query_pos = \strpos($request_uri, '?');
        if ($query_pos === false) $path_info = $request_uri;
        else $path_info = \substr($_SERVER["REQUEST_URI"], 0, $query_pos);

        // Get base uri and remove it from request uri
        $apiUrl = \file_get_contents(API_PATH."/apiUrl.txt");
        // Trim front and trailing slashes
        $request = trim(\str_ireplace($apiUrl, "", $path_info), '/');

        // Split into controllers, actions, params
        $request_parts = explode('/', $request);
        if (!isset($request_parts[0]) || empty($request_parts[0])) $request_parts[0] = DEFAULT_CONTROLLER;
        if (!isset($request_parts[1]) || empty($request_parts[1])) $request_parts[1] = DEFAULT_ACTION;
        if (!isset($request_parts[2]) || empty($request_parts[2])) $request_parts[2] = null;

        // Decorate them
        $controller = \str_replace('-', '', \ucwords(\strtolower($request_parts[0]), '-'));
        $action = \str_replace('-', '', \ucwords(\strtolower($request_parts[1]), '-'));
        $method = \strtolower($_SERVER['REQUEST_METHOD']);
        $params = \array_slice($request_parts, 2);

        $callable = array("Controllers\\{$controller}", "{$method}{$action}");
        
        if (!\class_exists($callable[0])) {
            throw new ClassNotFoundException($callable[0]);
        }

        if (!\method_exists($callable[0], $callable[1])) {
            throw new MethodNotFoundException($callable[0], $callable[1]);
        }

        if (\call_user_func_array(array(new $callable[0], $callable[1]), $params) === false) {
            throw new ApiException("Api Error: Unable to call controller method.");
        }
    }
}