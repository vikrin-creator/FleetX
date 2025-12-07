<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$db_name = 'u177524058_Fleetx';
$username = 'u177524058_Fleetx';
$password = 'Devima@0812';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get items for category 5 (Air Brake & Wheel)
    $stmt = $pdo->prepare("SELECT * FROM category_items WHERE category_id = 5 AND status = 'active' ORDER BY name ASC");
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Category items retrieved successfully',
        'data' => $items,
        'category_id' => 5,
        'items_count' => count($items)
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>