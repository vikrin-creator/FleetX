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
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $data['amount'], // Amount in cents
            'currency' => 'usd',
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
            'metadata' => [
                'order_id' => $data['orderId'] ?? '',
                'user_id' => $data['userId'] ?? '',
            ],
        ]);
        
        echo json_encode([
            'success' => true,
            'clientSecret' => $paymentIntent->client_secret,
            'paymentIntentId' => $paymentIntent->id
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
