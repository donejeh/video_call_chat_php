<?php 
include_once("core/init.php");

if (!$userObj->isLoggedIn()) {
    $userObj->redirect('index.php');
}

$user = $userObj->logout();
?>