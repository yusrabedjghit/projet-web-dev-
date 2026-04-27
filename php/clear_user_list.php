<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? '';
$type  = $input['type'] ?? '';

if ($email === '' || $type === '') {
    echo json_encode(["error" => "missing params"]);
    exit;
}

// récupérer l'id utilisateur
$sql = "SELECT id FROM utilisateur WHERE email = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();
if (!$row) {
    echo json_encode(["error" => "user not found"]);
    exit;
}
$user_id = (int)$row['id'];

if ($type === 'possession') {
    $sqlDel = "DELETE FROM possessions WHERE id_utilisateur = ?";
    $stmtDel = $conn->prepare($sqlDel);
    $stmtDel->bind_param("i", $user_id);
    $stmtDel->execute();
} elseif ($type === 'vu' || $type === 'envie_de_voir') {
    $sqlDel = "DELETE FROM films_utilisateur WHERE id_utilisateur = ? AND statut = ?";
    $stmtDel = $conn->prepare($sqlDel);
    $stmtDel->bind_param("is", $user_id, $type);
    $stmtDel->execute();
} else {
    echo json_encode(["error" => "unknown type"]);
    exit;
}

echo json_encode(["success" => true]);
