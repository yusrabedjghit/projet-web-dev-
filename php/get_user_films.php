<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$email = $_GET['email'] ?? '';
if ($email === '') {
    echo json_encode(["error" => "email manquant"]);
    exit;
}

// 1. récupérer l'id de l'utilisateur
$sqlUser = "SELECT id FROM utilisateur WHERE email = ? LIMIT 1";
$stmtUser = $conn->prepare($sqlUser);
$stmtUser->bind_param("s", $email);
$stmtUser->execute();
$resUser = $stmtUser->get_result();
$rowUser = $resUser->fetch_assoc();

if (!$rowUser) {
    echo json_encode([
        "possession" => [],
        "vu" => [],
        "envie_de_voir" => []
    ]);
    exit;
}

$user_id = (int)$rowUser['id'];

/* ------------------ Possessions ------------------ */
$possession = [];
// adapte les statuts à ce que tu as réellement en DB
$sqlPos = "
  SELECT f.id, f.titre, f.annee, f.image
  FROM possessions p
  JOIN film f ON f.id = p.id_film
  WHERE p.id_utilisateur = ?
    AND (p.statut = 'souhaite_separer' OR p.statut = 'a_vendre' OR p.statut = 'a_donner')
";
$stmtPos = $conn->prepare($sqlPos);
$stmtPos->bind_param("i", $user_id);
$stmtPos->execute();
$resPos = $stmtPos->get_result();
while ($row = $resPos->fetch_assoc()) {
    $possession[] = $row;
}

/* ------------------ Films vus ------------------ */
$vu = [];
$sqlVu = "
  SELECT f.id, f.titre, f.annee, f.image
  FROM films_utilisateur fu
  JOIN film f ON f.id = fu.id_film
  WHERE fu.id_utilisateur = ?
    AND fu.statut = 'vu'
";
$stmtVu = $conn->prepare($sqlVu);
$stmtVu->bind_param("i", $user_id);
$stmtVu->execute();
$resVu = $stmtVu->get_result();
while ($row = $resVu->fetch_assoc()) {
    $vu[] = $row;
}

/* ------------------ Envie de voir ------------------ */
$envie = [];
$sqlEnvie = "
  SELECT f.id, f.titre, f.annee, f.image
  FROM films_utilisateur fu
  JOIN film f ON f.id = fu.id_film
  WHERE fu.id_utilisateur = ?
    AND fu.statut = 'envie_de_voir'
";
$stmtEnvie = $conn->prepare($sqlEnvie);
$stmtEnvie->bind_param("i", $user_id);
$stmtEnvie->execute();
$resEnvie = $stmtEnvie->get_result();
while ($row = $resEnvie->fetch_assoc()) {
    $envie[] = $row;
}

echo json_encode([
    "possession" => $possession,
    "vu" => $vu,
    "envie_de_voir" => $envie
]);
