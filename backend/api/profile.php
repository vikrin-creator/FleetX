<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_profile':
        getUserProfile();
        break;
    case 'change_password':
        changePassword();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

function getUserProfile() {
    $userId = $_GET['userId'] ?? null;
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            SELECT id, name, first_name, last_name, email, phone, email_verified, created_at
            FROM users 
            WHERE id = ?
        ");
        
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        // Use 'name' if first_name/last_name are empty
        if (empty($user['first_name']) && empty($user['last_name']) && !empty($user['name'])) {
            $user['first_name'] = $user['name'];
        }
        
        // Convert email_verified to boolean
        $user['email_verified'] = (bool)$user['email_verified'];
        
        echo json_encode(['success' => true, 'user' => $user]);
        
    } catch (PDOException $e) {
        error_log("Get user profile error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to fetch profile']);
    }
}

function changePassword() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $userId = $data['userId'] ?? null;
    $currentPassword = $data['currentPassword'] ?? null;
    $newPassword = $data['newPassword'] ?? null;
    
    if (!$userId || !$currentPassword || !$newPassword) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }
    
    if (strlen($newPassword) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        // Get current user password
        $stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        // Verify current password
        if (!password_verify($currentPassword, $user['password'])) {
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            return;
        }
        
        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        // Update password
        $stmt = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashedPassword, $userId]);
        
        echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
        
    } catch (PDOException $e) {
        error_log("Change password error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to change password']);
    }
}
?>
