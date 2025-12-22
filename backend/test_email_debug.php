<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once 'utils/email-smtp.php';

// Test using the actual config file
function testWithConfigFile($email, $otp_code) {
    $config = require __DIR__ . '/config/email.php';
    
    echo "<h3>Using Config File Settings:</h3>";
    echo "Host: " . $config['smtp_host'] . "<br>";
    echo "Port: " . $config['smtp_port'] . "<br>";  
    echo "Secure: " . $config['smtp_secure'] . "<br>";
    echo "Username: " . $config['smtp_username'] . "<br>";
    echo "<br>";
    
    try {
        $mail = new PHPMailer(true);
        
        // Enable verbose debug output
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = 'html';
        
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'];
        $mail->Password = $config['smtp_password'];
        
        if ($config['smtp_secure'] === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else if ($config['smtp_secure'] === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }
        $mail->Port = $config['smtp_port'];
        
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($email);
        $mail->Subject = 'Test Email - Config File';
        $mail->Body = 'Test email with OTP: ' . $otp_code . ' (Using config file settings)';
        
        $mail->send();
        echo "<br><strong style='color:green'>✓ SUCCESS: Email sent using config file!</strong><br>";
        
    } catch (Exception $e) {
        echo "<br><strong style='color:red'>✗ FAILED using config file</strong><br>";
        echo "Error: " . $mail->ErrorInfo . "<br>";
        echo "Exception: " . $e->getMessage() . "<br>";
    }
}

// Check server IP
echo "<h3>Server Information:</h3>";
echo "Server IP: " . ($_SERVER['SERVER_ADDR'] ?? 'Unknown') . "<br>";
echo "Server Name: " . ($_SERVER['SERVER_NAME'] ?? 'Unknown') . "<br>";
echo "HTTP Host: " . ($_SERVER['HTTP_HOST'] ?? 'Unknown') . "<br>";

echo "<h3>Testing Email with Current Config:</h3>";
testWithConfigFile('test@example.com', '123456');
?>