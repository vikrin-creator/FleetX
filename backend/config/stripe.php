<?php
// Stripe Configuration
// Set these in your server's environment variables or .env file
// Never commit secret keys to version control

$stripeSecretKey = getenv('STRIPE_SECRET_KEY') ?: 'your_stripe_secret_key_here';
$stripePublicKey = getenv('STRIPE_PUBLIC_KEY') ?: 'pk_test_51Sc8ijKGf2r0XJoC0MYKBJPbtVG3yIKO1XMORxRvqXwppDYSOWUxZjRKxsIQTN2VPYKn0B3Wzv7uBeoLwxDnqPIH007sxY1MkX';

return [
    'secret_key' => $stripeSecretKey,
    'public_key' => $stripePublicKey,
];
