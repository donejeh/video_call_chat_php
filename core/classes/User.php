<?php
namespace MyApp;
use PDO;
class User{

    public $conn , $userID, $sessionID;
    
    /**
     * __construct
     *
     * @return void
     */
    public function  __construct(){
        $db = new \MyApp\DB();
        $this->conn = $db->connect();
        $this->userID = $this->ID();
        $this->sessionID = $this->getSessionID();
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

    public function getSessionID(){
       return session_id();
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
     * @return object
     */
    public function userData($userID =''){
        $userID =  ((empty($userID)) ? $this->userID : $userID);
    
        $sql = "SELECT * FROM users WHERE userID = :userID";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":userID", $userID, PDO::PARAM_INT); 
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if($user){
            return $user;
        }else{
            return false;
        }
    }

    public function getUsers(){
        $sql = "SELECT * FROM users where userID != :userID";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":userID", $this->userID, PDO::PARAM_INT);
        $stmt->execute();

        $users = $stmt->fetchAll(PDO::FETCH_OBJ);

        foreach($users as $user){

            echo '<li class="select-none transition hover:bg-green-50 p-4 cursor-pointer select-none">
            <a href="'.BASE_URL.$user->username.'">
                <div class="user-box flex items-center flex-wrap">
                <div class="flex-shrink-0 user-img w-14 h-14 rounded-full border overflow-hidden">
                    <img class="w-full h-full" src="'.BASE_URL.$user->profileImage.'">
                </div>
                <div class="user-name ml-2">
                    <div><span class="flex font-medium">'.$user->name.'</span></div>
                    <div></div>
                </div>
                </div>
            </a>
        </li>';
        }

        // if($users){
        //     return $users;
        // }else{
        //     return false;
        // }
    }
    
    /**
     * userByUsername
     *
     * @param  mixed $username
     * @return object
     */
    public function userByUsername($username){
        $sql = "SELECT * FROM users WHERE username = :username";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if($user){
            return $user;
        }else{
            return false;
        }
    }
    
    /**
     * updateSessionID
     *
     * @return void
     */
    public function updateSessionID(){
        $sql = "UPDATE users SET sessionID = :sessionID WHERE userID = :userID";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":sessionID", $this->sessionID, PDO::PARAM_STR);
        $stmt->bindParam(":userID", $this->userID, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function updateConnection($userID,$connectionID){
        $sql = "UPDATE users SET connectionID = :connectionID WHERE userID = :userID";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":connectionID", $connectionID, PDO::PARAM_STR);
        $stmt->bindParam(":userID", $userID, PDO::PARAM_INT);
        $stmt->execute();
    }

    
    /**
     * getUserBySessionID
     *
     * @param  mixed $sessionID
     * @return object
     */
    public function getUserBySessionID($sessionID){
        $sql = "SELECT * FROM users WHERE sessionID = :sessionID";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":sessionID", $sessionID, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_OBJ);

        if($user){
            return $user;
        }else{
            return false;
        }
    }
    
    /**
     * updateProfileImage
     *
     * @param  mixed $profileImage
     * @return void
     */
    public function updateProfileImage($profileImage){
        $sql = "UPDATE users SET profileImage = :profileImage WHERE userID = :userID";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":profileImage", $profileImage, PDO::PARAM_STR);
        $stmt->bindParam(":userID", $this->userID, PDO::PARAM_INT);
        $stmt->execute();
    }
}
