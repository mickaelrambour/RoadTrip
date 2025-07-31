<?php
// myLocation.php
header('Content-Type: application/json');

$LOC_KEY = 'mic';
if (!isset($_GET['key']) || $_GET['key'] !== $LOC_KEY) {
    http_response_code(403);
    echo json_encode(['error'=>'Forbidden']);
    exit;
}

$file = __DIR__.'/currentLocation.json';
if (!file_exists($file)) {
    echo json_encode(['lat'=>null,'lon'=>null]);
    exit;
}

echo file_get_contents($file);
