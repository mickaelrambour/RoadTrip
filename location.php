<?php
header('Content-Type: application/json');
$dir = __DIR__ . '/uploads';
$markers = [];

foreach (scandir($dir) as $cityDir) {
  if ($cityDir === '.' || $cityDir === '..') continue;
  $metaFile = "$dir/$cityDir/meta.json";
  if (file_exists($metaFile)) {
    $meta = json_decode(file_get_contents($metaFile), true);
    if (isset($meta['lat'], $meta['lon'], $meta['city'])) {
      $markers[] = $meta;
    }
  }
}

echo json_encode($markers);
