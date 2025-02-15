<?php

// Headers settings to allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); 

// Get posted data
$post = json_decode(file_get_contents("php://input"), true); 
$proc = $post['proc'];
if ($proc == null) {
    echo json_encode([
        "statusCode" => 403,
        "data" => 'Access denied'
    ]);
    exit;
}

// Open connection
// $host = "host";
// $login = "login";
// $password = "password";
// $database = "database";
require './dbconfig.php';

try {
    $connection = mysqli_connect($host, $login, $password, $database);
    mysqli_set_charset($connection, "utf8");
} catch (Exception $e) {
    $resp = $e->getMessage();
    echo json_encode([
        "statusCode" => 400,
        "data" => $resp
    ]);
    mysqli_close($connection); 
    exit;
}

// Run procedures
if ($proc == 'recordAccess') {
    $appName = $post['appName'];
    if ($appName == null) {
        echo json_encode([
            "statusCode" => 400,
            "data" => 'appName not found'
        ]);
        mysqli_close($connection); 
        exit;
    }
    $sql = "INSERT INTO solveredu_access (`app`,`date`, `count`) VALUES ('$appName', NOW(), 1) ON DUPLICATE KEY UPDATE count = count + 1";
    try {
        mysqli_query($connection, $sql);
    } catch (Exception $e) {
        $resp = $e->getMessage();
        echo json_encode([
            "statusCode" => 500,
            "data" => $resp
        ]);
        mysqli_close($connection); 
        exit;
    }
    echo json_encode([
        "statusCode" => 200,
        "data" => 'Access recorded'
    ]);

}



// Close connection
mysqli_close($connection); 