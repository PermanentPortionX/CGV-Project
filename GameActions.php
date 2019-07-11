<?php
/**
 * Created by PhpStorm.
 * User: Mbuso Makitla
 * Date: 5/8/2019
 * Time: 4:48 PM
 */

require_once("WitsEdgeDBManager.php");
require_once("Constants.php");

$databaseManager = new WitsEdgeDBManager();

$choice = $_REQUEST[Constants::ACTION];

switch ($choice){
    case Constants::ADD_SCORE:
        $score_id = 0;
        $Score = $_REQUEST[Constants::PLAYER_SCORE];
        $Player_username = $_REQUEST[Constants::PLAYER_USERNAME];


        $stmt = "INSERT INTO ".Constants::GAME_SCORE." VALUES( :ID, :SCORE, :PU)";
        $args = array(':ID'=> $score_id, ':SCORE'=> $Score , ':PU'=> $Player_username);
        $databaseManager ->executeStatement($stmt, $args, false );

        break;

    case Constants::GET_SCORE:
        $stmt = "SELECT * FROM ".Constants::GAME_SCORE."ORDER BY".Constants::PLAYER_SCORE." DESC";
        $args = array();
        $databaseManager ->executeFetchStatement($stmt, $args);

        break;
}