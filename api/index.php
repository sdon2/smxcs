<?php

// Autoloader
require_once(__DIR__."/vendor/autoload.php");

// Load config
require_once(__DIR__."/config.php");

// Init session
Helpers\Session::start();

// Set timezone
date_default_timezone_set('Asia/Kolkata');

$app = new Core\ApiApp();
$app->registerErrorHandlers();
$app->run();