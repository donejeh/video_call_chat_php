<?php 

class DB{
    function connect(){
        $db = new PDO("mysql:host=localhost;dbname=vchat", "root", "");

        return $db;
    }
}

?>