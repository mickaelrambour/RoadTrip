<?php
header('Content-Type: application/json');

$body = file_get_contents('php://input');
file_put_contents(__DIR__.'/lastPayload.log', $body); // pour debug

$data = json_decode($body, true);

// Extraction flexible
$lat = $data['lat'] ?? null;
$lon = $data['lon'] ?? null;
$key = $data['key'] ?? ($_GET['key'] ?? null);

// Support OwnTracks format
if (!isset($key) && isset($data['_type']) && $data['_type'] === 'location') {
    $key = 'mic'; // clé par défaut
    $lat = $data['lat'];
    $lon = $data['lon'];
}

// Vérification
if ($key !== 'mic' || $lat === null || $lon === null) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden or missing data']);
    exit;
}

// ➕ Reverse geocoding (OpenStreetMap Nominatim)
$city = null;
$opts = [
    'http' => [
        'method' => 'GET',
        'header' => 'User-Agent: RoadTripApp/1.0 (contact@example.com)'
    ]
];
$context = stream_context_create($opts);
$geo = @file_get_contents("https://nominatim.openstreetmap.org/reverse?format=json&lat=$lat&lon=$lon&zoom=10&addressdetails=1", false, $context);
if ($geo === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch location data']);
    exit;
}
if ($geo) {
    $j = json_decode($geo, true);
    $city = $j['address']['city']
        ?? $j['address']['town']
        ?? $j['address']['village']
        ?? $j['address']['hamlet']
        ?? $j['address']['suburb']
        ?? null;
}
file_put_contents(__DIR__.'/lastNominatim.json', $geo);

// Enregistrement
file_put_contents(__DIR__.'/currentLocation.json', json_encode([
    'lat' => $lat,
    'lon' => $lon,
    'city' => $city,
    'timestamp' => time()
]));

echo json_encode(['ok' => true, 'city' => $city]);
