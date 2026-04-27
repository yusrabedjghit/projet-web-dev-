<?php
header("Content-Type: application/json");

// Connexion à la base
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "films_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Erreur de connexion : " . $conn->connect_error]));
}

// Requête
$sql = "SELECT univers, saga, film, date_sortie AS date FROM films";
$result = $conn->query($sql);

$films = [];
while ($row = $result->fetch_assoc()) {
    $films[] = $row;
}

echo json_encode($films);
$conn->close();
?>
