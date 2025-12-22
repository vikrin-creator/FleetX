<?php
require_once __DIR__ . '/utils/email-smtp.php';

echo "Testing email functionality...\n";

// Test OTP email
$result = sendOTPEmail('testuser@gmail.com', '123456');
echo "OTP Email Result: " . json_encode($result) . "\n";

// Test password reset email
$result2 = sendPasswordResetEmail('testuser@gmail.com', '987654');
echo "Password Reset Email Result: " . json_encode($result2) . "\n";
?>