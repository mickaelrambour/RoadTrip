<?php
header('Content-Type: application/json; charset=utf-8');
define('COMMENTS_FILE', __DIR__.'/comments.json');
if (!file_exists(COMMENTS_FILE)) {
    file_put_contents(COMMENTS_FILE, json_encode([], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
}

$action = $_REQUEST['action'] ?? 'list';
$all = json_decode(file_get_contents(COMMENTS_FILE), true);

if ($action === 'list') {
    // on renvoie la liste complète (avec réactions + replies)
    echo json_encode($all, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'add') {
    // 1️⃣ Ajouter un nouveau commentaire
    $visitor = trim($_POST['visitor'] ?? '');
    $comment = trim($_POST['comment'] ?? '');
    if ($visitor === '' || $comment === '') {
        http_response_code(400);
        echo json_encode(['error'=>'Champs requis']);
        exit;
    }
    $entry = [
        'visitor'   => htmlspecialchars($visitor, ENT_QUOTES, 'UTF-8'),
        'comment'   => htmlspecialchars($comment, ENT_QUOTES, 'UTF-8'),
        'date'      => date('d/m/Y H:i'),
        'reactions' => [],    // contiendra {'👍':3, '😂':1, ...}
        'replies'   => []     // contiendra liste de replies
    ];
    array_unshift($all, $entry);
    file_put_contents(COMMENTS_FILE, json_encode($all, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
    echo json_encode(['success'=>true]);
    exit;
}

if ($action === 'react') {
    // 2️⃣ Incrémenter une réaction
    $id    = intval($_POST['id'] ?? -1);
    $emoji = $_POST['emoji'] ?? '';
    if (!isset($all[$id])) {
        http_response_code(400);
        echo json_encode(['error'=>'Comment not found']);
        exit;
    }
    if (!isset($all[$id]['reactions'][$emoji])) {
        $all[$id]['reactions'][$emoji] = 0;
    }
    $all[$id]['reactions'][$emoji]++;
    file_put_contents(COMMENTS_FILE, json_encode($all, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
    echo json_encode(['success'=>true]);
    exit;
}

if ($action === 'reply') {
    // 3️⃣ Ajouter une réponse
    $id    = intval($_POST['id'] ?? -1);
    $reply = trim($_POST['reply'] ?? '');
    if (!isset($all[$id]) || $reply === '') {
        http_response_code(400);
        echo json_encode(['error'=>'Invalid data']);
        exit;
    }
    $entry = [
        'micus'   => htmlspecialchars('Micus', ENT_QUOTES, 'UTF-8'), // on garde "Anonyme" pour les replies
        'visitor' => htmlspecialchars('Anonyme', ENT_QUOTES, 'UTF-8'),
        'comment' => htmlspecialchars($reply, ENT_QUOTES, 'UTF-8'),
        'date'    => date('d/m/Y H:i')
    ];
    $all[$id]['replies'][] = $entry;
    file_put_contents(COMMENTS_FILE, json_encode($all, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
    echo json_encode(['success'=>true]);
    exit;
}

http_response_code(400);
echo json_encode(['error'=>'Action inconnue']);
