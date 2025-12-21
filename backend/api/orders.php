<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

$action = $_GET['action'] ?? '';

try {
    $pdo = getDBConnection();
    
    switch ($action) {
        case 'save_order':
            saveOrder($pdo);
            break;
            
        case 'get_user_orders':
            getUserOrders($pdo);
            break;
            
        case 'get_all_orders':
            getAllOrders($pdo);
            break;
            
        case 'get_order_details':
            getOrderDetails($pdo);
            break;
            
        case 'update_status':
            updateOrderStatus($pdo);
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function saveOrder($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['userId']) || !isset($data['items']) || empty($data['items'])) {
        echo json_encode(['success' => false, 'message' => 'User ID and items are required']);
        return;
    }
    
    $userId = $data['userId'];
    $items = $data['items'];
    $shippingAddress = $data['shippingAddress'] ?? [];
    $paymentMethod = $data['paymentMethod'] ?? 'COD';
    $subtotal = $data['subtotal'] ?? 0;
    $shippingCost = $data['shippingCost'] ?? 0;
    $total = $data['total'] ?? 0;
    $shippingAddressId = $data['shippingAddressId'] ?? null;
    
    // Generate unique order number
    $orderNumber = 'ORD-' . strtoupper(uniqid()) . '-' . time();
    
    try {
        $pdo->beginTransaction();
        
        // Insert order
        $stmt = $pdo->prepare("
            INSERT INTO orders (
                user_id, order_number, shipping_address_id,
                full_name, phone, address_line1, address_line2, 
                city, state, zip_code, country,
                payment_method, subtotal, shipping_cost, total, status
            ) VALUES (
                :user_id, :order_number, :shipping_address_id,
                :full_name, :phone, :address_line1, :address_line2,
                :city, :state, :zip_code, :country,
                :payment_method, :subtotal, :shipping_cost, :total, 'pending'
            )
        ");
        
        $stmt->execute([
            ':user_id' => $userId,
            ':order_number' => $orderNumber,
            ':shipping_address_id' => $shippingAddressId,
            ':full_name' => $shippingAddress['fullName'] ?? '',
            ':phone' => $shippingAddress['phone'] ?? '',
            ':address_line1' => $shippingAddress['addressLine1'] ?? '',
            ':address_line2' => $shippingAddress['addressLine2'] ?? '',
            ':city' => $shippingAddress['city'] ?? '',
            ':state' => $shippingAddress['state'] ?? '',
            ':zip_code' => $shippingAddress['zipCode'] ?? '',
            ':country' => $shippingAddress['country'] ?? '',
            ':payment_method' => $paymentMethod,
            ':subtotal' => $subtotal,
            ':shipping_cost' => $shippingCost,
            ':total' => $total
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        // Insert order items
        $itemStmt = $pdo->prepare("
            INSERT INTO order_items (
                order_id, product_id, product_name, part_number, 
                price, quantity, image_url
            ) VALUES (
                :order_id, :product_id, :product_name, :part_number,
                :price, :quantity, :image_url
            )
        ");
        
        foreach ($items as $item) {
            $itemStmt->execute([
                ':order_id' => $orderId,
                ':product_id' => $item['id'] ?? 0,
                ':product_name' => $item['name'] ?? '',
                ':part_number' => $item['part_number'] ?? '',
                ':price' => $item['price'] ?? 0,
                ':quantity' => $item['quantity'] ?? 1,
                ':image_url' => $item['image'] ?? ''
            ]);
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Order placed successfully',
            'orderId' => $orderId,
            'orderNumber' => $orderNumber
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Failed to save order: ' . $e->getMessage()]);
    }
}

function getUserOrders($pdo) {
    $userId = $_GET['userId'] ?? null;
    
    if (!$userId) {
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                o.id,
                o.order_number,
                o.full_name,
                o.phone,
                o.address_line1,
                o.address_line2,
                o.city,
                o.state,
                o.zip_code,
                o.country,
                o.payment_method,
                o.subtotal,
                o.shipping_cost,
                o.total,
                o.status,
                o.created_at,
                COUNT(oi.id) as item_count
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = :user_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        ");
        
        $stmt->execute([':user_id' => $userId]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'orders' => $orders]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch orders: ' . $e->getMessage()]);
    }
}

function getAllOrders($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                o.id,
                o.user_id,
                o.order_number,
                o.full_name,
                o.phone,
                o.address_line1,
                o.address_line2,
                o.city,
                o.state,
                o.zip_code,
                o.country,
                o.payment_method,
                o.subtotal,
                o.shipping_cost,
                o.total,
                o.status,
                o.created_at,
                u.email,
                COUNT(oi.id) as item_count
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN users u ON o.user_id = u.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        ");
        
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'orders' => $orders]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch orders: ' . $e->getMessage()]);
    }
}

function getOrderDetails($pdo) {
    $orderId = $_GET['orderId'] ?? null;
    
    if (!$orderId) {
        echo json_encode(['success' => false, 'message' => 'Order ID is required']);
        return;
    }
    
    try {
        // Get order details with user email
        $stmt = $pdo->prepare("
            SELECT o.*, u.email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = :order_id
        ");
        $stmt->execute([':order_id' => $orderId]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            return;
        }
        
        // Get order items
        $itemStmt = $pdo->prepare("
            SELECT * FROM order_items WHERE order_id = :order_id
        ");
        $itemStmt->execute([':order_id' => $orderId]);
        $items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $order['items'] = $items;
        
        echo json_encode(['success' => true, 'order' => $order]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch order details: ' . $e->getMessage()]);
    }
}

function updateOrderStatus($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['orderId']) || !isset($data['status'])) {
        echo json_encode(['success' => false, 'message' => 'Order ID and status are required']);
        return;
    }
    
    $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!in_array($data['status'], $validStatuses)) {
        echo json_encode(['success' => false, 'message' => 'Invalid status']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE orders SET status = :status WHERE id = :order_id
        ");
        
        $stmt->execute([
            ':status' => $data['status'],
            ':order_id' => $data['orderId']
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Order status updated successfully']);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update order status: ' . $e->getMessage()]);
    }
}
