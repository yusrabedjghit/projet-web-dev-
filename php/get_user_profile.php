<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$email = $_GET['email'] ?? '';

if ($email === '') {
    echo json_encode(["error" => "email manquant"]);
    exit;
}

$sql = "SELECT id, nom_utilisateur, email FROM utilisateur WHERE email = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();
$user = $res->fetch_assoc();

if (!$user) {
    echo json_encode([
        "nom_utilisateur" => "Inconnu",
        "email" => $email
    ]);
    exit;
}

echo json_encode($user);
