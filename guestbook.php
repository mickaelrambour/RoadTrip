<?php
// guestbook.php
header('Content-Type: application/json; charset=utf-8');

define('GUESTBOOK_FILE', __DIR__ . '/guestbook.json');
define('GUESTBOOK_KEY', 'mic');  // la clé d’accès
define('GUESTBOOK_AUTHOR', 'micus'); // nom affiché par défaut

// Initialisation du fichier si nécessaire
if (!file_exists(GUESTBOOK_FILE)) {
    file_put_contents(GUESTBOOK_FILE, json_encode([], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
}

$action = $_REQUEST['action'] ?? 'list';

switch ($action) {
    case 'list':
        $data = json_decode(file_get_contents(GUESTBOOK_FILE), true);
        if (!is_array($data)) $data = [];
        echo json_encode($data);
        exit;

    case 'add':
        // Vérification de la clé
        $key = $_POST['key'] ?? '';
        if ($key !== GUESTBOOK_KEY) {
            http_response_code(403);
            echo json_encode(['error' => 'Clé invalide']);
            exit;
        }

        // Récupération et validation du message
        $message = trim($_POST['message'] ?? '');
        if ($message === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Le message est requis']);
            exit;
        }

        // Prépare l’entrée avec l’auteur par défaut
        $entry = [
            'name'    => GUESTBOOK_AUTHOR,
            'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
            'date'    => date('d/m/Y H:i')
        ];

        // Stocke en tête de fichier
        $all = json_decode(file_get_contents(GUESTBOOK_FILE), true);
        if (!is_array($all)) $all = [];
        array_unshift($all, $entry);
        file_put_contents(
            GUESTBOOK_FILE,
            json_encode($all, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)
        );

        echo json_encode(['success' => true]);
        exit;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Action inconnue']);
        exit;
}
