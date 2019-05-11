<?php
/**
 * Created by PhpStorm.
 * User: Mbuso Makitla
 * Date: 5/8/2019
 * Time: 4:45 PM
 */
require_once ("Constants.php");
require_once ("ServerInfo.php");

class WitsEdgeDBManager{
    private  $pdo;

    function __construct() {
        $dsn = "mysql:host=".ServerInfo::serverProxy.";dbname=".ServerInfo::database.";charset=utf8mb4";

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this -> pdo = new PDO($dsn, ServerInfo::userName, ServerInfo::userPassword, $options);
        }
        catch (PDOException $e) {
            echo $e -> getMessage();
        }
    }

    function __destruct(){
        $this -> pdo = null;
    }

    function executeFetchStatement($stmt, $args){
        try{
            $execStmt = $this -> pdo -> prepare($stmt, $args);
            if ($execStmt -> execute($args)) echo json_encode($execStmt -> fetchAll());
            else echo Constants::DEFAULT_JSON;

        }
        catch (PDOException $e){
            echo Constants::DEFAULT_JSON;
        }
    }

    function executeStatement($stmt, $args, $provideFeedBack){
        try{
            $execStmt = $this -> pdo -> prepare($stmt);

            if($execStmt -> execute($args)){
                if ($provideFeedBack) return true;
                else echo Constants::SUCCESS;
            }
            else {
                if ($provideFeedBack) return false;
                else echo Constants::FAILED;
            }
        }
        catch(PDOException $e){
            echo $e -> getMessage();
        }
    }

    function exists($stmt, $args){
        try{
            $execStmt = $this -> pdo -> prepare($stmt);
            if($execStmt -> execute($args)) return $execStmt -> rowCount() > 0;
            else return false;
        }
        catch(PDOException $e){
            echo $e -> getMessage();
            return false;
        }

    }
}