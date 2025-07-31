<?php
// directions.php
header('Content-Type: application/json');

// Répertoire de cache (assure-toi qu'il existe et est inscriptible)
$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Lecture du JSON envoyé
$body = file_get_contents('php://input');
$data = json_decode($body, true);

// Vérif
if (!isset($data['coordinates']) || !is_array($data['coordinates'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid coordinates']);
    exit;
}

// on injecte la préférence “shortest” pour minimiser les km
$data['preference'] = 'fastest';

// Injecter avoid_features
$data['options'] = ['avoid_features' => ['highways']];

// Re-encode pour hash + payload
$payload = json_encode($data);
$hash    = md5($payload);
$cacheFile = "{$cacheDir}/{$hash}.json";

// 1) Si cache existe, on renvoie directement
if (file_exists($cacheFile)) {
    echo file_get_contents($cacheFile);
    exit;
}

// 2) Sinon, on fait l'appel ORS
$ORS_API_KEY = '5b3ce3597851110001cf6248772aef67ce1543fb89fb763ab21d566f';

$ch = curl_init('https://api.openrouteservice.org/v2/directions/driving-car/geojson');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    "Authorization: {$ORS_API_KEY}"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$code     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 3) Si succès, on sauve dans le cache
if ($code === 200 && $response) {
    file_put_contents($cacheFile, $response);
}

// 4) On renvoie la réponse brute (même en cas d’erreur)
http_response_code($code);
echo $response;