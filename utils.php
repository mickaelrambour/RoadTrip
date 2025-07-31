<?php
function slugify(string $city): string {
    $slug = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $city); // supprime accents
    $slug = strtolower($slug);                                // minuscule
    $slug = str_replace(' ', '_', $slug);                     // espaces → underscore
    $slug = preg_replace('/[^a-z0-9\-_]/', '', $slug);        // caractères valides
    return $slug;
}
