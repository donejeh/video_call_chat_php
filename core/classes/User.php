<?php

class User{

    public $conn , $userID;
    
    /**
     * __construct
     *
     * @return void
     */
    public function  __construct(){
        $db = new DB();
        $this->conn = $db->connect();
        $this->userID = $this->ID();
    }
    
    /**
     * EmailExist
     *
     * @param  mixed $email
     * @return void
     */
    public function EmailExist($email){
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if($user){
            return $user;
        }else{
            return false;
        }
    }
    
    /**
     * hash
     *
     * @param  mixed $password
     * @return void
     */
    public function hash($password){
        $hash = password_hash($password, PASSWORD_DEFAULT);
        return $hash;
    }
    
    /**
     * redirect
     *
     * @param  mixed $location
     * @return void
     */
    public function redirect($location){
        header("Location: ".BASE_URL.$location);
    }
    
    /**
     * ID
     *
     * @return void
     */
    public function ID(){
       if($this->isLoggedIn()){
           return $_SESSION['userID'];
       }
    }
    
    /**
     * isLoggedIn
     *
     * @return void
     */
    public function isLoggedIn(){
        if(isset($_SESSION['userID'])){
            return true;
        }else{
            return false;
        }
    }

    public function logout(){
        $_SESSION = array();
        session_destroy();
        session_regenerate_id(true);
        $this->redirect('index.php');
    }
    
    /**
     * userData
     *
     * @param  mixed $userID
     * @return void
     */
    public function userData($userID =''){
        $userID =  ((empty($userID)) ? $this->userID : $userID);
    
        $sql = "SELECT * FROM users WHERE userID = :userID";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":userID", $userID);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if($user){
            return $user;
        }else{
            return false;
        }
    }

    // public function login($email, $password){

    //     $sql = "SELECT * FROM users WHERE email = :email AND password = :password";
    //     $stmt = $this->conn->prepare($sql);
    //     $stmt->bindParam(":email", $email);
    //     $stmt->bindParam(":password", $password);
    //     $stmt->execute();

    //     $user = $stmt->fetch(PDO::FETCH_OBJ);

    //     if($user){
    //         $_SESSION['user_id'] = $user->id;
    //         $_SESSION['user_name'] = $user->name;
    //         $_SESSION['user_email'] = $user->email;
    //         $_SESSION['user_image'] = $user->image;
    //         $_SESSION['user_status'] = $user->status;
    //         $_SESSION['user_created_at'] = $user->created_at;

    //         header("Location: ".BASE_URL."home.php");
    //     }else{
    //         $error = "Invalid email or password";
    //         return $error;
    //     }
    // }
}
