<?php
require_once 'utils.php';
header('Content-Type: application/json');

$cityRaw = $_GET['city'] ?? '';
$slug = slugify($cityRaw);
$dir  = __DIR__ . "/uploads/{$slug}";
$out  = [];

if (is_dir($dir)) {
    foreach (scandir($dir) as $f) {
        if ($f === '.' || $f === '..') continue;
        if (!preg_match('/\.(jpe?g|png|gif|webp)$/i', $f)) continue;
        $out[] = "/uploads/{$slug}/{$f}";
    }
}

echo json_encode(['files' => $out]);
