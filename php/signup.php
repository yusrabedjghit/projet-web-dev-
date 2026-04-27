<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$input = json_decode(file_get_contents("php://input"), true);
if (!$input || empty($input["email"]) || empty($input["password"]) || empty($input["name"])) {
    echo json_encode(["error" => "Champs manquants"]);
    exit;
}

$host = "localhost";
$user = "root";
$pass = "";
$db = "films";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connexion à la base impossible"]);
    exit;
}

$email = $conn->real_escape_string($input["email"]);
$name = $conn->real_escape_string($input["name"]);
$password = password_hash($input["password"], PASSWORD_DEFAULT);

$check = $conn->query("SELECT id FROM utilisateur WHERE email='$email'");
if ($check->num_rows > 0) {
    echo json_encode(["error" => "Cet email est déjà utilisé"]);
    exit;
}

$sql = "INSERT INTO utilisateur (nom_utilisateur, email, mot_de_passe) VALUES ('$name', '$email', '$password')";
if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Erreur lors de l'inscription"]);
}

$conn->close();
?>
