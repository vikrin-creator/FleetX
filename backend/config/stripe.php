<?php
// Stripe Configuration
// Load from .env file
$envFile = __DIR__ . '/../.env';
$stripeSecretKey = 'your_stripe_secret_key_here';
$stripePublicKey = 'pk_test_51Sc8ijKGf2r0XJoC0MYKBJPbtVG3yIKO1XMORxRvqXwppDYSOWUxZjRKxsIQTN2VPYKn0B3Wzv7uBeoLwxDnqPIH007sxY1MkX';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Skip comments
        
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);
            
            if ($key === 'STRIPE_SECRET_KEY') {
                $stripeSecretKey = $value;
            } elseif ($key === 'STRIPE_PUBLIC_KEY') {
                $stripePublicKey = $value;
            }
        }
    }
}

return [
    'secret_key' => $stripeSecretKey,
    'public_key' => $stripePublicKey,
];
