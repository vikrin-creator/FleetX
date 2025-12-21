<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load Stripe config
$stripeConfig = require __DIR__ . '/../config/stripe.php';

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'create_payment_intent':
            createPaymentIntent($stripeConfig);
            break;
            
        case 'confirm_payment':
            confirmPayment($stripeConfig);
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function createPaymentIntent($stripeConfig) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['amount'])) {
        echo json_encode(['success' => false, 'message' => 'Amount is required']);
        return;
    }
    
    try {
        // Create Checkout Session using cURL
        $sessionData = [
            'payment_method_types[]' => 'card',
            'line_items[0][price_data][currency]' => 'usd',
            'line_items[0][price_data][product_data][name]' => 'Order #' . ($data['orderId'] ?? 'New Order'),
            'line_items[0][price_data][unit_amount]' => $data['amount'],
            'line_items[0][quantity]' => 1,
            'mode' => 'payment',
            'success_url' => 'https://sandybrown-squirrel-472536.hostingersite.com/my-orders?payment=success',
            'cancel_url' => 'https://sandybrown-squirrel-472536.hostingersite.com/checkout?payment=cancelled',
            'metadata[order_id]' => $data['orderId'] ?? '',
            'metadata[user_id]' => $data['userId'] ?? '',
        ];
        
        $ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($sessionData));
        curl_setopt($ch, CURLOPT_USERPWD, $stripeConfig['secret_key'] . ':');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $session = json_decode($response, true);
        
        if ($httpCode === 200 && isset($session['url'])) {
            echo json_encode([
                'success' => true,
                'sessionId' => $session['id'],
                'url' => $session['url']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $session['error']['message'] ?? 'Failed to create checkout session'
            ]);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function confirmPayment($stripeConfig) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['sessionId'])) {
        echo json_encode(['success' => false, 'message' => 'Session ID is required']);
        return;
    }
    
    try {
        // Retrieve checkout session using cURL
        $ch = curl_init('https://api.stripe.com/v1/checkout/sessions/' . $data['sessionId']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERPWD, $stripeConfig['secret_key'] . ':');
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $session = json_decode($response, true);
        
        if ($httpCode === 200) {
            echo json_encode([
                'success' => true,
                'status' => $session['payment_status'],
                'amount' => $session['amount_total'],
                'currency' => $session['currency']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $session['error']['message'] ?? 'Failed to retrieve session'
            ]);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
