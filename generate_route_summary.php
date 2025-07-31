<?php
// generate_route_summary.php
header('Content-Type: text/plain; charset=utf-8');

// 1) Ta liste de villes (copie‐la depuis config.js)
$cities = [
  ['Paris',[48.824512,2.365747]],
  ['Apremont-sur-Allier',[46.8644,3.0178]],
  ['Salers',[45.0571,2.5872]],
  ['Saint-Cirq-Lapopie',[44.4642,1.6719]],
  ['Cordes-sur-Ciel',[44.0639,1.9556]],
  ['Salles-sur-Garonne',[43.2006,1.1819]],
  ['Lautrec',[43.705,2.1381]],
  ['La Couvertoirade',[43.9139,3.3164]],
  ['Gordes',[43.912,5.2]],
  ['Moustiers-Sainte-Marie',[43.8433,6.2225]],
  ['Nice',[43.7102,7.262]],
  ['Sisteron',[44.1956,5.9469]],
  ['Montélimar',[44.5584,4.7509]],
  ['Pérouges',[45.975,5.1236]],
  ['Annemasse',[46.1944,6.2378]],
  ['Semur-en-Auxois',[47.4376,4.2607]],
  ['Paris',[48.824512,2.365747]]
];

// 2) Pour chaque tronçon on appelle google_time.php
$summary = [ null ];  // indice 0 inutilisé
foreach (range(1, count($cities)-1) as $i) {
    list(, $from) = $cities[$i-1];
    list(, $to  ) = $cities[$i];

    $payload = json_encode(['coordinates'=>[[$from[0],$from[1]],[$to[0],$to[1]]]]);
    $opts = ['http'=>[
        'method'=>"POST",
        'header'=>"Content-Type: application/json\r\n",
        'content'=>$payload
    ]];
    $ctx = stream_context_create($opts);
    $res = @file_get_contents('https://'.($_SERVER['HTTP_HOST'] ?? 'micus.fr').'/google_time.php', false, $ctx);
    $data = $res ? json_decode($res, true) : null;

    $summary[$i] = [
      'distance_m' => $data['distance_m'] ?? null,
      'duration_s' => $data['duration_s'] ?? null
    ];
    echo "Leg $i: " 
       . ($summary[$i]['distance_m']!==null ? round($summary[$i]['distance_m']/1000,1).' km' : '—')
       . ', '
       . ($summary[$i]['duration_s']!==null ? round($summary[$i]['duration_s']/3600,2).' h' : '—')
       . "\n";
}

// 3) Sauvegarde dans JSON
file_put_contents(__DIR__.'/route_summary.json', json_encode($summary, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
echo "\nroute_summary.json généré avec ".(count($summary)-1)." tronçons.\n";
