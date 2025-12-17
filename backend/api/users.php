<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/Response.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_all':
        getAllUsers();
        break;
    default:
        Response::error('Invalid action', 400);
}

/**
 * Get all users
 */
function getAllUsers() {
    try {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            SELECT 
                id,
                first_name,
                last_name,
                email,
                phone,
                email_verified,
                created_at
            FROM users
            ORDER BY created_at DESC
        ");
        
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Convert email_verified to boolean
        foreach ($users as &$user) {
            $user['email_verified'] = (bool)$user['email_verified'];
        }
        
        Response::success([
            'users' => $users,
            'count' => count($users)
        ]);
        
    } catch (PDOException $e) {
        error_log("Get users error: " . $e->getMessage());
        Response::error('Failed to fetch users', 500);
    }
}
?>
