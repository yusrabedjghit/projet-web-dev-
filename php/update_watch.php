<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

/*
  TABLE attendue :
  films_utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    id_film INT NOT NULL,
    statut ENUM('vu','envie_de_voir') NOT NULL,
    date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY u_user_film (id_utilisateur, id_film)
  )
*/

function get_user_id_by_email(mysqli $conn, string $email): int {
    $sql = "SELECT id FROM utilisateur WHERE email = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    return $row ? (int)$row['id'] : 0;
}

function get_film_id_by_title(mysqli $conn, string $titre): int {
    $sql = "SELECT id FROM film WHERE titre = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $titre);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    return $row ? (int)$row['id'] : 0;
}

/* ============ GET : lire le statut ============ */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = $_GET['email'] ?? '';
    $filmTitre = $_GET['film'] ?? '';

    if ($email === '' || $filmTitre === '') {
        echo json_encode(["statut" => "none", "error" => "missing params"]);
        exit;
    }

    $user_id = get_user_id_by_email($conn, $email);
    $film_id = get_film_id_by_title($conn, $filmTitre);

    if (!$user_id || !$film_id) {
        echo json_encode(["statut" => "none"]);
        exit;
    }

    $sql = "SELECT statut FROM films_utilisateur
            WHERE id_utilisateur = ? AND id_film = ?
            LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $film_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    echo json_encode([
        "statut" => $row ? $row['statut'] : "none"
    ]);
    exit;
}

/* ============ POST : modifier le statut ============ */
$input = json_decode(file_get_contents("php://input"), true);
$email     = $input['email'] ?? '';
$filmTitre = $input['film'] ?? '';
$statut    = $input['statut'] ?? 'none';

if ($email === '' || $filmTitre === '') {
    http_response_code(400);
    echo json_encode(["error" => "email or film missing"]);
    exit;
}

$user_id = get_user_id_by_email($conn, $email);
$film_id = get_film_id_by_title($conn, $filmTitre);

if (!$user_id || !$film_id) {
    http_response_code(404);
    echo json_encode(["error" => "user or film not found"]);
    exit;
}

// si l'utilisateur remet à "none" → supprimer
if ($statut === 'none') {
    $sql = "DELETE FROM films_utilisateur
            WHERE id_utilisateur = ? AND id_film = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $user_id, $film_id);
    $stmt->execute();

    echo json_encode(["success" => true, "statut" => "none"]);
    exit;
}

// sinon insérer / mettre à jour
$sql = "INSERT INTO films_utilisateur (id_utilisateur, id_film, statut, date_action)
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            statut = VALUES(statut),
            date_action = NOW()";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $user_id, $film_id, $statut);
$stmt->execute();

echo json_encode(["success" => true, "statut" => $statut]);
