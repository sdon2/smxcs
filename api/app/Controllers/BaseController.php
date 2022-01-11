<?php namespace Controllers;

use Core\ApiController;
use Helpers\JWT\JWT;

abstract class BaseController extends ApiController {
    public function convertToMysqlDate($date, $includeTime = false) {
        // Format javascript date to mysql date
        $datetime = new \DateTime();
        $datetime->setTimestamp(strtotime($date));
        $format = 'Y-m-d';
        if ($includeTime) $format .= ' h:i:s';
        return \date_format($datetime, $format);
    }
}
