<?php

use Exceptions\ApiException;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
if (!$loaded = $dotenv->safeLoad()) {
    throw new ApiException('.env file not found');
}

$dotenv->required(['FINANCIAL_YEAR', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'SMS_API_USERNAME', 'SMS_API_PASSWORD', 'SMS_API_SENDER', 'SMS_API_KEY']);

$mode = in_array($_ENV['APP_ENV'] ?? '', ['local', 'development']);
define('DEVELOPMENT', $mode);
ini_set("display_errors", $mode);
ini_set("html_errors", $mode);

define("DB_HOST", $_ENV['DB_HOST'] ?? '');
define("DB_NAME", $_ENV['DB_NAME'] ?? '');
define("DB_USER", $_ENV['DB_USER'] ?? '');
define("DB_PASSWORD", $_ENV['DB_PASS'] ?? '');

define("DEFAULT_CONTROLLER", "Home");
define("DEFAULT_ACTION", "Index");

define("API_PATH", __DIR__);
define("VIEW_PATH", __DIR__."/app/Views");

define("SESSION_VAR", "sfibvgixdv");

// roles
define('BRANCH', 1);
define('ACCOUNTANT', 2);
define('OWNER', 3);
define('ADMIN', 4);

// consignment statuses
define('NEWCONSIGNMENT', 1);
define('ONTRANSIT', 2);
define('RECEIVED', 3);
define('DELIVERED', 4);

define("STATUSES", [1 => 'new', 'on transit', 'received', 'delivered']);

// SMS gateway credentials
// define('SMS_GATEWAY', 'http://login.bulksmsgateway.in/sendmessage.php'); // do not set for smsindiahub
define('SMS_USERNAME', $_ENV['SMS_API_USERNAME'] ?? '');
define('SMS_PASSWORD', $_ENV['SMS_API_PASSWORD'] ?? '');
define('SMS_SENDER', $_ENV['SMS_API_SENDER'] ?? '');

// Option names for saving options in database
define('OPT_REMAINING_SMS', 'RemainingSMS');

define('SMS_API_KEY', $_ENV['SMS_API_KEY'] ?? '');

define('CONSIGNOR_SMS_FORMAT', "SRI MEENAKSHI XPRESS%nDear Customer, LR No.{consignment_no} of {items} [TPR-BLR] to {party} has confirmed. For Query: 9361110030, 9361110035. Thanks.");

define('CONSIGNEE_SMS_FORMAT', "SRI MEENAKSHI XPRESS%nDear Customer, LR No.{consignment_no} of {items} [TPR-BLR] by {party} has confirmed. For Query: 9361110030, 9361110035. Thanks.");
