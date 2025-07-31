<?php
require_once 'utils.php';
header('Content-Type: application/json');

$UPLOAD_KEY = 'mic';
if (!isset($_GET['key']) || $_GET['key'] !== $UPLOAD_KEY) {
    http_response_code(403);
    echo json_encode(['error'=>'Forbidden']);
    exit;
}

$cityRaw = $_GET['city'] ?? '';
$slug = slugify($cityRaw);
if (!$slug) {
    http_response_code(400);
    echo json_encode(['error'=>'City missing']);
    exit;
}

$uploadDir = __DIR__ . "/uploads/{$slug}";
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$filesOut = [];
foreach ($_FILES['photos']['tmp_name'] as $i => $tmp) {
    $name   = basename($_FILES['photos']['name'][$i]);
    $target = "{$uploadDir}/{$name}";
    if (move_uploaded_file($tmp, $target)) {
        $filesOut[] = "/uploads/{$slug}/{$name}";
    }
}

$lat = isset($_GET['lat']) ? floatval($_GET['lat']) : null;
$lon = isset($_GET['lon']) ? floatval($_GET['lon']) : null;
if ($lat !== null && $lon !== null) {
    $metaFile = "$uploadDir/meta.json";
    $metaData = [
        'city' => $cityRaw,
        'lat' => $lat,
        'lon' => $lon,
        'timestamp' => time()
    ];
    file_put_contents($metaFile, json_encode($metaData));
}

echo json_encode(['files'=>$filesOut]);
