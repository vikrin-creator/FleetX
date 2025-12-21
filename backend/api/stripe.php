<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/stripe.php';

// You'll need to install Stripe PHP SDK via Composer
// composer require stripe/stripe-php

$stripeConfig = require '../config/stripe.php';
\Stripe\Stripe::setApiKey($stripeConfig['secret_key']);

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'create_payment_intent':
            createPaymentIntent();
            break;
            
        case 'confirm_payment':
            confirmPayment();
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function createPaymentIntent() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['amount'])) {
        echo json_encode(['success' => false, 'message' => 'Amount is required']);
        return;
    }
    
    try {
        // Create Checkout Session instead of Payment Intent
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Order #' . ($data['orderId'] ?? 'New Order'),
                    ],
                    'unit_amount' => $data['amount'], // Amount in cents
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => 'https://sandybrown-squirrel-472536.hostingersite.com/my-orders?payment=success',
            'cancel_url' => 'https://sandybrown-squirrel-472536.hostingersite.com/checkout?payment=cancelled',
            'metadata' => [
                'order_id' => $data['orderId'] ?? '',
                'user_id' => $data['userId'] ?? '',
            ],
        ]);
        
        echo json_encode([
            'success' => true,
            'sessionId' => $session->id,
            'url' => $session->url
        ]);
        
    } catch (\Stripe\Exception\ApiErrorException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

function confirmPayment() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['paymentIntentId'])) {
        echo json_encode(['success' => false, 'message' => 'Payment Intent ID is required']);
        return;
    }
    
    try {
        $paymentIntent = \Stripe\PaymentIntent::retrieve($data['paymentIntentId']);
        
        echo json_encode([
            'success' => true,
            'status' => $paymentIntent->status,
            'amount' => $paymentIntent->amount,
            'currency' => $paymentIntent->currency
        ]);
        
    } catch (\Stripe\Exception\ApiErrorException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
