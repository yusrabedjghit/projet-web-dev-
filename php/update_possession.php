<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$host = "localhost";
$user = "root";
$pass = "";
$db = "films";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["error" => "Erreur de connexion BDD"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Obtenir statut actuel
    $email = $_GET["email"] ?? '';
    $film = $_GET["film"] ?? '';
    if (!$email || !$film) {
        echo json_encode(["error" => "Paramètres manquants"]);
        exit;
    }

    $res = $conn->query("
        SELECT p.statut FROM possessions p
        JOIN utilisateur u ON p.id_utilisateur = u.id
        JOIN film f ON p.id_film = f.id
        WHERE u.email = '$email' AND f.titre = '$film'
        LIMIT 1
    ");

    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        echo json_encode(["status" => $row["statut"]]);
    } else {
        echo json_encode(["status" => "possede"]);
    }
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || empty($data["email"]) || empty($data["film"])) {
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

$email = $conn->real_escape_string($data["email"]);
$film = $conn->real_escape_string($data["film"]);

// Trouver les IDs
$q1 = $conn->query("SELECT id FROM utilisateur WHERE email = '$email'");
$q2 = $conn->query("SELECT id FROM film WHERE titre = '$film'");
if (!$q1 || !$q2 || $q1->num_rows === 0 || $q2->num_rows === 0) {
    echo json_encode(["error" => "Utilisateur ou film introuvable"]);
    exit;
}
$id_user = $q1->fetch_assoc()["id"];
$id_film = $q2->fetch_assoc()["id"];

// Vérifie si la possession existe
$res = $conn->query("SELECT statut FROM possessions WHERE id_utilisateur = $id_user AND id_film = $id_film");

if ($res && $res->num_rows > 0) {
    $row = $res->fetch_assoc();
    $newStatus = ($row["statut"] === "possede") ? "souhaite_separer" : "possede";
    $conn->query("UPDATE possessions SET statut = '$newStatus' WHERE id_utilisateur = $id_user AND id_film = $id_film");
    echo json_encode(["success" => true, "status" => $newStatus]);
} else {
    $conn->query("INSERT INTO possessions (id_utilisateur, id_film, statut) VALUES ($id_user, $id_film, 'possede')");
    echo json_encode(["success" => true, "status" => "possede"]);
}

$conn->close();
?>
