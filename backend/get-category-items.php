<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get category ID from URL parameter
$categoryId = $_GET['category_id'] ?? null;

if (!$categoryId) {
    echo json_encode([
        'success' => false,
        'error' => 'Category ID is required'
    ]);
    exit;
}

// Database connection
$host = 'localhost';
$db_name = 'u177524058_Fleetx';
$username = 'u177524058_Fleetx';
$password = 'Devima@0812';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get items for specific category
    $stmt = $pdo->prepare("SELECT * FROM category_items WHERE category_id = ? AND status = 'active' ORDER BY name ASC");
    $stmt->execute([$categoryId]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Category items retrieved successfully',
        'data' => $items,
        'category_id' => intval($categoryId),
        'items_count' => count($items)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>