<?php 
session_start();

require_once 'classes/DB.php';
require_once 'classes/User.php';

$userObj = new \MyApp\User();

define('BASE_URL', 'http://localhost/videocall/');





?>