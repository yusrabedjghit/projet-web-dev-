<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = "localhost";
$user = "root";
$pass = "";
$db = "films";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["error" => "Connexion échouée: " . $conn->connect_error]);
    exit;
}

// Récupérer tous les films avec univers + saga
$sql = "
    SELECT 
      u.id AS univers_id, u.nom AS univers, u.genre,
      s.id AS saga_id, s.nom AS saga,
      f.id AS film_id, f.titre AS film, f.annee AS date, f.image, f.synopsis
    FROM univers u
    JOIN saga s ON s.id_univers = u.id
    JOIN film f ON f.id_saga = s.id
    ORDER BY u.id, s.id, f.id
";

$result = $conn->query($sql);

$univers = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $uNom = $row['univers'];
        $sNom = $row['saga'];

        if (!isset($univers[$uNom])) {
            $univers[$uNom] = [
                "univers" => $uNom,
                "genre" => $row["genre"],
                "sagas" => []
            ];
        }

        // Ajouter la saga si pas encore créée
        $sagas = &$univers[$uNom]["sagas"];
        $sagaIndex = array_search($sNom, array_column($sagas, "saga"));
        if ($sagaIndex === false) {
            $sagas[] = [
                "saga" => $sNom,
                "films" => []
            ];
            $sagaIndex = count($sagas) - 1;
        }

        // Ajouter le film
        $sagas[$sagaIndex]["films"][] = [
            "film_id" => $row["film_id"],
            "film" => $row["film"],
            "date" => $row["date"],
            "image" => $row["image"],
            "synopsis" => $row["synopsis"]
        ];
    }
}

echo json_encode(array_values($univers), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$conn->close();
?>
