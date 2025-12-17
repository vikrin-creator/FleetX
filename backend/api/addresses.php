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
require_once __DIR__ . '/../utils/Response.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'save':
        saveAddress();
        break;
    case 'get_all':
        getUserAddresses();
        break;
    case 'delete':
        deleteAddress();
        break;
    case 'set_default':
        setDefaultAddress();
        break;
    default:
        Response::error('Invalid action', 400);
}

/**
 * Save a new address
 */
function saveAddress() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $userId = $data['userId'] ?? null;
    $fullName = $data['fullName'] ?? '';
    $phone = $data['phone'] ?? '';
    $addressLine1 = $data['addressLine1'] ?? '';
    $addressLine2 = $data['addressLine2'] ?? '';
    $city = $data['city'] ?? '';
    $state = $data['state'] ?? '';
    $zipCode = $data['zipCode'] ?? '';
    $country = $data['country'] ?? '';
    $isDefault = $data['isDefault'] ?? false;
    
    if (!$userId || !$fullName || !$phone || !$addressLine1 || !$city || !$state || !$zipCode) {
        Response::error('Required fields are missing', 400);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        // Check if address already exists
        $stmt = $db->prepare("
            SELECT id FROM user_addresses 
            WHERE user_id = ? AND address_line1 = ? AND city = ? AND zip_code = ?
        ");
        $stmt->execute([$userId, $addressLine1, $city, $zipCode]);
        
        if ($stmt->fetch()) {
            Response::success(['message' => 'Address already exists']);
            return;
        }
        
        // If this is set as default, unset other defaults
        if ($isDefault) {
            $stmt = $db->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = ?");
            $stmt->execute([$userId]);
        }
        
        // Insert new address
        $stmt = $db->prepare("
            INSERT INTO user_addresses 
            (user_id, full_name, phone, address_line1, address_line2, city, state, zip_code, country, is_default, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $userId,
            $fullName,
            $phone,
            $addressLine1,
            $addressLine2,
            $city,
            $state,
            $zipCode,
            $country,
            $isDefault ? 1 : 0
        ]);
        
        Response::success([
            'message' => 'Address saved successfully',
            'addressId' => $db->lastInsertId()
        ]);
        
    } catch (PDOException $e) {
        error_log("Save address error: " . $e->getMessage());
        Response::error('Failed to save address', 500);
    }
}

/**
 * Get all addresses for a user
 */
function getUserAddresses() {
    $userId = $_GET['userId'] ?? null;
    
    if (!$userId) {
        Response::error('User ID is required', 400);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            SELECT * FROM user_addresses 
            WHERE user_id = ?
            ORDER BY is_default DESC, created_at DESC
        ");
        
        $stmt->execute([$userId]);
        $addresses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Convert is_default to boolean
        foreach ($addresses as &$address) {
            $address['is_default'] = (bool)$address['is_default'];
        }
        
        Response::success(['addresses' => $addresses]);
        
    } catch (PDOException $e) {
        error_log("Get addresses error: " . $e->getMessage());
        Response::error('Failed to fetch addresses', 500);
    }
}

/**
 * Delete an address
 */
function deleteAddress() {
    $data = json_decode(file_get_contents('php://input'), true);
    $addressId = $data['addressId'] ?? null;
    
    if (!$addressId) {
        Response::error('Address ID is required', 400);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        $stmt = $db->prepare("DELETE FROM user_addresses WHERE id = ?");
        $stmt->execute([$addressId]);
        
        Response::success(['message' => 'Address deleted successfully']);
        
    } catch (PDOException $e) {
        error_log("Delete address error: " . $e->getMessage());
        Response::error('Failed to delete address', 500);
    }
}

/**
 * Set an address as default
 */
function setDefaultAddress() {
    $data = json_decode(file_get_contents('php://input'), true);
    $addressId = $data['addressId'] ?? null;
    $userId = $data['userId'] ?? null;
    
    if (!$addressId || !$userId) {
        Response::error('Address ID and User ID are required', 400);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        // Unset all defaults for this user
        $stmt = $db->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = ?");
        $stmt->execute([$userId]);
        
        // Set new default
        $stmt = $db->prepare("UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?");
        $stmt->execute([$addressId, $userId]);
        
        Response::success(['message' => 'Default address updated']);
        
    } catch (PDOException $e) {
        error_log("Set default address error: " . $e->getMessage());
        Response::error('Failed to set default address', 500);
    }
}
?>
