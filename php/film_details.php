<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

// Activer les erreurs strictes MySQLi
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = "localhost";
$user = "root";
$pass = "";
$db = "films";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4"); // UTF-8

if ($conn->connect_error) {
    echo json_encode(["error" => "Connexion échouée : " . $conn->connect_error]);
    exit;
}

// Vérifie qu'on a le paramètre 'titre'
if (!isset($_GET["titre"]) || empty($_GET["titre"])) {
    echo json_encode(["error" => "Paramètre 'titre' manquant"]);
    exit;
}

$titre = $_GET["titre"];

// Récupérer le film et ses informations
$sqlFilm = "
    SELECT 
        f.id AS film_id, f.titre, f.annee, f.image, f.synopsis,
        s.nom AS saga, u.nom AS univers, u.genre
    FROM film f
    JOIN saga s ON f.id_saga = s.id
    JOIN univers u ON s.id_univers = u.id
    WHERE f.titre = ?
    LIMIT 1
";

$stmtFilm = $conn->prepare($sqlFilm);
$stmtFilm->bind_param("s", $titre);
$stmtFilm->execute();
$resultFilm = $stmtFilm->get_result();

if (!$resultFilm || $resultFilm->num_rows === 0) {
    echo json_encode(["error" => "Film non trouvé"]);
    exit;
}

$film = $resultFilm->fetch_assoc();

// Récupérer les utilisateurs souhaitant se séparer
$sqlUsers = "
    SELECT 
        u.nom_utilisateur,
        u.email,
        p.statut
    FROM possessions p
    JOIN utilisateur u ON p.id_utilisateur = u.id
    WHERE p.id_film = ?
";

$stmtUsers = $conn->prepare($sqlUsers);
$stmtUsers->bind_param("i", $film['film_id']);
$stmtUsers->execute();
$resultUsers = $stmtUsers->get_result();

$utilisateurs = [];
if ($resultUsers && $resultUsers->num_rows > 0) {
    while ($row = $resultUsers->fetch_assoc()) {
        $utilisateurs[] = $row;
    }
}

$film["utilisateurs"] = $utilisateurs;

echo json_encode($film, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$stmtFilm->close();
$stmtUsers->close();
$conn->close();
?>
