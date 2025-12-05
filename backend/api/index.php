<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

// Get request method and URI
$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Parse the request URI
$uri_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

// Remove 'api' and 'v1' from the path
$uri_parts = array_slice($uri_parts, 2);

// Get the resource (e.g., 'vehicles', 'users')
$resource = $uri_parts[0] ?? '';
$id = $uri_parts[1] ?? null;

// Route to appropriate controller
try {
    $controller_file = __DIR__ . "/{$resource}.php";
    
    if (file_exists($controller_file)) {
        require_once $controller_file;
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error' => getenv('APP_DEBUG') === 'true' ? $e->getMessage() : null
    ]);
}
