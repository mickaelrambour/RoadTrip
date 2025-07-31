<?php
// google_time.php
header('Content-Type: application/json; charset=utf-8');

// Récupère le payload JSON { "coordinates": [ [lat1,lon1], [lat2,lon2] ] }
$body = json_decode(file_get_contents('php://input'), true);
if (
    !isset($body['coordinates'][0][0], $body['coordinates'][0][1],
           $body['coordinates'][1][0], $body['coordinates'][1][1])
) {
    http_response_code(400);
    echo json_encode(['error'=>'Mauvaises coordonnées']);
    exit;
}

list($lat1, $lon1) = $body['coordinates'][0];
list($lat2, $lon2) = $body['coordinates'][1];

// Ta clé API Google (idéalement stockée en var d’environnement)
$GOOGLE_KEY = getenv('GOOGLE_API_KEY') ?: 'AIzaSyBJi-b_Ls55RzrErulSt2gjU17F7wSDPck';

$url = sprintf(
  'https://maps.googleapis.com/maps/api/directions/json?origin=%1$F,%2$F'
 . '&destination=%3$F,%4$F'
 . '&mode=driving'
 . '&avoid=highways'
 . '&key=%5$s',
  $lat1, $lon1, $lat2, $lon2, $GOOGLE_KEY
);

$resp = file_get_contents($url);
if ($resp === false) {
    http_response_code(502);
    echo json_encode(['error'=>'Erreur appel Google']);
    exit;
}

$data = json_decode($resp, true);
// on vérifie qu’on a bien un itinéraire
if (
    empty($data['routes'][0]['legs'][0]['duration']['value'])
) {
    http_response_code(500);
    echo json_encode(['error'=>'Pas de résultat']);
    exit;
}

$leg = $data['routes'][0]['legs'][0];
$result = [
  'distance_m' => $leg['distance']['value'],
  'duration_s' => $leg['duration']['value']
];
echo json_encode($result);
