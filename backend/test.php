<?php
// Simple test endpoint
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'PHP API is working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
    ]
]);
?>