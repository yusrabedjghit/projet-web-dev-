<?php
// db.php — connexion MySQL
$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASS = "";
$DB_NAME = "films";

$conn = @new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_errno) {
  http_response_code(500);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode([
    "error" => "DB connect failed",
    "detail" => $conn->connect_error
  ]);
  exit;
}

$conn->set_charset("utf8mb4");
