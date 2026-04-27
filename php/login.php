<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$input = json_decode(file_get_contents("php://input"), true);
if (!$input || empty($input["email"]) || empty($input["password"])) {
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
$password = $input["password"];

$sql = "SELECT id, nom_utilisateur, email, mot_de_passe FROM utilisateur WHERE email = '$email' LIMIT 1";
$result = $conn->query($sql);

if (!$result || $result->num_rows === 0) {
    echo json_encode(["error" => "Email introuvable"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user["mot_de_passe"])) {
    echo json_encode(["error" => "Mot de passe incorrect"]);
    exit;
}

// Retirer le mot de passe avant envoi
unset($user["mot_de_passe"]);

echo json_encode([
    "success" => true,
    "user" => $user
]);

$conn->close();
?>
