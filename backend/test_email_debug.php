<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once 'utils/email-smtp.php';

// Enable detailed debugging
function testEmailWithDebug($email, $otp_code) {
    try {
        $mail = new PHPMailer(true);
        
        // Enable verbose debug output
        $mail->SMTPDebug = 2; // Show detailed SMTP debug info
        $mail->Debugoutput = 'html';
        
        $mail->isSMTP();
        $mail->Host = 'smtpout.secureserver.net';
        $mail->SMTPAuth = true;
        $mail->Username = 'sarwan@fleetxusa.com';
        $mail->Password = 'Sarwan2005';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        $mail->setFrom('sarwan@fleetxusa.com', 'Fleet X Parts');
        $mail->addAddress($email);
        $mail->Subject = 'Test Email';
        $mail->Body = 'Test email with OTP: ' . $otp_code;
        
        $mail->send();
        echo "Email sent successfully!\n";
        
    } catch (Exception $e) {
        echo "Email failed: " . $mail->ErrorInfo . "\n";
        echo "Exception: " . $e->getMessage() . "\n";
    }
}

echo "Testing with detailed SMTP debugging...\n";
testEmailWithDebug('test@example.com', '123456');
?>