<?php
  $locationKey = $_GET['key'] ?? '';
  $canUpload   = ($locationKey === 'mic');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RoadTrip Août 2025</title>
  <link rel="stylesheet" href="dashboard.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
  <script>
    window.CAN_UPLOAD = <?= $canUpload ? 'true' : 'false' ?>;
  </script>
</head>
<body>
<div class="dashboard-wrapper">
<div class="grid-dashboard">
  <header class="card dashboard-header">
    <h1>RoadTrip Août 2025</h1>
    <span id="countdown">J-…</span>
  </header>
  
  <div class="card map-card">

    <?php if ($canUpload): ?>
      <button id="global-upload-btn" class="upload-fixed-btn">📤 Ajouter une photo ici</button>
      <input type="file" id="global-upload-input" multiple style="display:none">
    <?php endif; ?>
    <div class="map-area">
      <div id="map"></div>
      <div class="sidebar">
        <div id="current-position" class="card"></div>
        <div id="weather-widget" class="card"><div class="weather-details"></div></div>
      </div>
    </div>
  </div>

  <div class="card timeline-card">
    <h2>Étapes &amp; distances</h2>
    <div id="city-list" class="timeline-grid"></div>
  </div>


  <div class="card-row">
 <!-- Journal intime -->
<div class="card journal-card">
  <h2>Mon journal intime</h2>

  <!-- Aperçu court -->
  <div class="journal-preview">
    <p>Suivez mon tour à moto en août 2025.</p>
  </div>

  <!-- Bouton toggle -->
  <button id="toggle-intro" class="btn-toggle">📖 Lire l’intro complète</button>

  <!-- Contenu dépliable -->
  <div id="journal-content" class="journal-full">
    <h3>En quête de bitume, de fromages et de virages&nbsp;!</h3>
    <p>Bon… j’en avais marre du métro-boulot-dodo.<br>
    Alors j’ai fait ce que tout adulte responsable ferait :<br>
    j’ai pris ma moto, j’ai calé un itinéraire avec plus de virages que de Wi-Fi,
    et je suis parti faire le tour de la France… en mode chevalier du bitume.</p>

    <p><strong>Au programme :</strong><br>
    – Des routes sinueuses à couper le souffle (et les pneus),<br>
    – Des paysages à tomber par terre (mais pas moi, promis),<br>
    – Des villages trop beaux pour être vrais (mais ils le sont),<br>
    – Des pauses photo toutes les 3 minutes (“attends, la lumière est folle là 🫣”),<br>
    – Du fromage local à chaque étape (c’est culturel hein),<br>
    – Des visites à la famille et aux copains qu’on voit jamais assez,<br>
    – Et surtout, zéro autoroute parce que les péages, c’est pour les faibles.</p>

    <p>De Paris à Salers, en passant par Saint-Cirq-Lapopie (oui c’est un vrai nom),
    je trace la route avec style, casque vissé et playlist nostalgie dans le casque.</p>

    <p>Ici tu peux suivre ma position en direct,
    comme un GPS… mais pour stalker avec classe.<br>
    Et si vous me cherchez : je suis quelque part entre un petit café de village
    et une route départementale perdue, en train de kiffer ma vie.</p>
  </div>

  <!-- Formulaire invité (privé) -->
  <div id="guestbook-form-container" style="display:none;">
    <form id="guestbook-form">
      <textarea name="message" rows="4" placeholder="Votre message…" required></textarea>
      <button type="submit">Envoyer</button>
    </form>
  </div>

  <!-- Messages existants -->
  <ul id="guestbook-messages"></ul>
</div>

  <div class="card comments-card">
    <h2>Messages</h2>
    <form id="comments-form">
      <input type="text" name="visitor" placeholder="Ton pseudo" required>
      <textarea name="comment" rows="3" placeholder="Ton message…" required></textarea>
      <button type="submit">Publier</button>
    </form>
    <ul id="comments-list" class="comment-list"></ul>
  </div>
</div>
  <div class="card gallery-card">
    <h2>Galerie photos</h2>
    <div id="gallery-container" class="gallery-grid"></div>
    <button id="load-more-gallery" style="display:none;">Voir plus</button>
  </div>



 <!-- 12) Réservations (privé) -->
    <?php if ($canUpload): ?>
        <!-- Youtube -->
   <div class="card youtube-card">
  <h2>Mes sons du roadtrip générés par IA</h2>
  <div id="youtube-gallery"></div>
</div>
    <div class="card reservations-card">
  <h2>Mes résa</h2>
  <div class="table-responsive">
     <table id="reservations-table">
                  <thead>
          <tr>
            <th>Période</th>
            <th>Hôtel</th>
            <th>Arrivée</th>
            <th>Départ</th>
            <th>Petit-déjeuner</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2 – 3 août</td>
            <td>Hôtel du Cerf</td>
            <td>16 h +</td>
            <td>10 h max</td>
            <td>€ 8,50</td>
            <td>€ 57,44</td>
          </tr>
          <tr>
            <td>3 – 4 août</td>
            <td>Maison d’hôtes La Grange</td>
            <td>17 h +</td>
            <td>11 h max</td>
            <td>Inclus</td>
            <td>€ Payé</td>
          </tr>
          <tr>
            <td>4 – 5 août</td>
            <td>Hôtel La Métairie & piscine</td>
            <td>14 h +</td>
            <td>12 h max</td>
            <td>€ 9,90</td>
            <td>€ Payé</td>
          </tr>
          <tr>
            <td>9 – 10 août</td>
            <td>La Roseraie</td>
            <td>16 h +</td>
            <td>11 h max</td>
            <td>Inclus</td>
            <td>€ Payé</td>
          </tr>
          <tr>
            <td>10 – 11 août</td>
            <td>Hôtel Font de Lauro</td>
            <td>15 h +</td>
            <td>10 h 30 max</td>
            <td>€ 10</td>
            <td>€ 71,45</td>
          </tr>
          <tr>
            <td>13 – 14 août</td>
            <td>Grand Hôtel du Cours</td>
            <td>15 h +</td>
            <td>11 h max</td>
            <td>€ 12</td>
            <td>€ 89,65</td>
          </tr>
          <tr>
            <td>14 – 16 août</td>
            <td>Première Classe Valence Nord – Saint-Marcel-lès-Valence</td>
            <td>14 h +</td>
            <td>12 h max</td>
            <td>Inclus</td>
            <td>€ 130,00</td>
          </tr>
          <tr>
            <td>16 – 17 août</td>
            <td>Hôtel La Bérangère</td>
            <td>14 h +</td>
            <td>11 h max</td>
            <td>€ 9,50</td>
            <td>€ 81,55</td>
          </tr>
          <tr>
            <td>19 – 20 août</td>
            <td>Hôtel des Cymaises</td>
            <td>14 h +</td>
            <td>10 h 30 max</td>
            <td>€ 9,50</td>
            <td>€ 95,80</td>
          </tr>
        </tbody>
        </table>
        </div> 
      </div>
    <?php endif; ?>

  <footer class="card dashboard-footer">
    <p>Made in France 🫣</p>
  </footer>
</div>
</div>
<div id="lightbox" style="display:none;">
  <span id="lightbox-title" class="lightbox-title"></span>
  <div id="lightbox-counter" class="lightbox-counter"></div>
  <button id="lightbox-close" class="lightbox-close">✖</button>
  <button id="lightbox-prev"  class="lightbox-arrow arrow-left">←</button>
  <img    id="lightbox-img"   src="" alt="Photo">
  <button id="lightbox-next"  class="lightbox-arrow arrow-right">→</button>
</div>
<!-- Fullscreen plugin -->
<!-- Leaflet core -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Fullscreen plugin -->
<link rel="stylesheet" href="https://unpkg.com/leaflet.fullscreen@2.4.0/Control.FullScreen.css" />
<script src="https://unpkg.com/leaflet.fullscreen@2.4.0/Control.FullScreen.js"></script>

<!-- Ton script -->
<script type="module" src="assets/js/dashboard.js"></script>
<script type="module" src="assets/js/weather.js"></script>
</body>
</html>
