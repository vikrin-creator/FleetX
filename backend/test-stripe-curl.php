<?php
// Test Stripe API with cURL
$stripeConfig = require __DIR__ . '/config/stripe.php';

echo "Testing Stripe Integration with cURL...\n\n";
echo "Using Secret Key: " . substr($stripeConfig['secret_key'], 0, 20) . "...\n\n";

// Create Checkout Session
$sessionData = [
    'payment_method_types[]' => 'card',
    'line_items[0][price_data][currency]' => 'usd',
    'line_items[0][price_data][product_data][name]' => 'Test Order #123',
    'line_items[0][price_data][unit_amount]' => 1000, // $10.00
    'line_items[0][quantity]' => 1,
    'mode' => 'payment',
    'success_url' => 'https://sandybrown-squirrel-472536.hostingersite.com/my-orders?payment=success',
    'cancel_url' => 'https://sandybrown-squirrel-472536.hostingersite.com/checkout?payment=cancelled',
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

echo "HTTP Status Code: $httpCode\n\n";

if ($httpCode === 200 && isset($session['url'])) {
    echo "✅ SUCCESS!\n";
    echo "Session ID: " . $session['id'] . "\n";
    echo "Payment URL: " . $session['url'] . "\n\n";
    echo "🎉 Stripe is working correctly! You can redirect users to the payment URL.\n";
} else {
    echo "❌ ERROR!\n";
    if (isset($session['error'])) {
        echo "Error Type: " . $session['error']['type'] . "\n";
        echo "Error Message: " . $session['error']['message'] . "\n";
    }
    echo "\nFull Response:\n";
    print_r($session);
}
