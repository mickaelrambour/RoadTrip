<?php
require_once 'utils.php';
header('Content-Type: application/json');

$baseDir = __DIR__ . '/uploads';
$out = [];

$folders = array_filter(scandir($baseDir), fn($f) =>
  $f !== '.' && $f !== '..' && is_dir("$baseDir/$f")
);

foreach ($folders as $slug) {
  $files = glob("$baseDir/$slug/*.{jpg,jpeg,png,gif,webp}", GLOB_BRACE);
  foreach ($files as $file) {
    $basename = basename($file);
    // Reverse slug for display
    $cityDisplay = ucwords(str_replace(['-', '_'], [' ', ' '], $slug));
    $out[] = [
      'city' => $cityDisplay,
      'file' => "/uploads/$slug/$basename"
    ];
  }
}

echo json_encode($out);

