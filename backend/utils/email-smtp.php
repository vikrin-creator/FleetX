<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// If you don't have PHPMailer installed via composer, download it manually
// Or use the simple mail() function as fallback

/**
 * Send OTP email using SMTP
 */
function sendOTPEmail($email, $otp_code) {
    // Email configuration for GoDaddy email with Outlook
    $smtp_host = 'smtp.office365.com'; // GoDaddy with Outlook uses Office365 SMTP
    $smtp_port = 587; // STARTTLS port
    $smtp_username = 'sarwan@fleetxusa.com'; // Full email address
    $smtp_password = 'Sarwan2005'; // GoDaddy email password
    $from_email = 'sarwan@fleetxusa.com';
    $from_name = 'Fleet X Parts';
    
    // Check if PHPMailer is available
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendOTPWithPHPMailer($email, $otp_code, $smtp_host, $smtp_port, $smtp_username, $smtp_password, $from_email, $from_name);
    } else {
        // Fallback to simple mail()
        return sendOTPWithMailFunction($email, $otp_code, $from_email, $from_name);
    }
}

/**
 * Send OTP using PHPMailer (recommended)
 */
function sendOTPWithPHPMailer($email, $otp_code, $smtp_host, $smtp_port, $smtp_username, $smtp_password, $from_email, $from_name) {
    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtp_port;
        
        // Recipients
        $mail->setFrom($from_email, $from_name);
        $mail->addAddress($email);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Your Fleet X Verification Code';
        $mail->Body = getOTPEmailTemplate($otp_code);
        $mail->AltBody = "Your Fleet X verification code is: $otp_code\n\nThis code will expire in 10 minutes.";
        
        $mail->send();
        return ['success' => true, 'message' => 'OTP sent successfully'];
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return ['success' => false, 'message' => 'Failed to send email: ' . $mail->ErrorInfo];
    }
}

/**
 * Send OTP using PHP mail() function (fallback)
 */
function sendOTPWithMailFunction($email, $otp_code, $from_email, $from_name) {
    $subject = 'Your Fleet X Verification Code';
    $message = getOTPEmailTemplate($otp_code);
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $from_name <$from_email>" . "\r\n";
    
    if (mail($email, $subject, $message, $headers)) {
        return ['success' => true, 'message' => 'OTP sent successfully'];
    } else {
        return ['success' => false, 'message' => 'Failed to send email'];
    }
}

/**
 * Get HTML email template for OTP
 */
function getOTPEmailTemplate($otp_code) {
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2B2A29 0%, #5B5B5B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #2B2A29; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #2B2A29; letter-spacing: 8px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Fleet X Parts</h1>
                <p>Email Verification</p>
            </div>
            <div class="content">
                <h2>Welcome to Fleet X Parts!</h2>
                <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
                
                <div class="otp-box">
                    <p style="margin: 0; color: #666;">Your Verification Code</p>
                    <div class="otp-code">' . $otp_code . '</div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> This code will expire in <strong>10 minutes</strong>.
                </div>
                
                <p>If you didn\'t request this code, please ignore this email or contact our support team.</p>
                
                <div class="footer">
                    <p>© 2024 Fleet X Parts. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ';
}

/**
 * Send password reset email
 */
function sendPasswordResetEmail($email, $otp_code) {
    // Email configuration for GoDaddy email with Outlook
    $smtp_host = 'smtp.office365.com';
    $smtp_port = 587;
    $smtp_username = 'sarwan@fleetxusa.com';
    $smtp_password = 'Sarwan2005';
    $from_email = 'sarwan@fleetxusa.com';
    $from_name = 'Fleet X Parts';
    
    // Check if PHPMailer is available
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendPasswordResetWithPHPMailer($email, $otp_code, $smtp_host, $smtp_port, $smtp_username, $smtp_password, $from_email, $from_name);
    } else {
        return sendPasswordResetWithMailFunction($email, $otp_code, $from_email, $from_name);
    }
}

/**
 * Send password reset using PHPMailer
 */
function sendPasswordResetWithPHPMailer($email, $otp_code, $smtp_host, $smtp_port, $smtp_username, $smtp_password, $from_email, $from_name) {
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtp_port;
        
        $mail->setFrom($from_email, $from_name);
        $mail->addAddress($email);
        
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset - Fleet X Parts';
        $mail->Body = getPasswordResetEmailTemplate($otp_code);
        $mail->AltBody = "Your Fleet X password reset code is: $otp_code\n\nThis code will expire in 10 minutes.\nIf you didn't request this, please ignore this email.";
        
        $mail->send();
        return ['success' => true, 'message' => 'Reset email sent successfully'];
    } catch (Exception $e) {
        error_log("Password reset email failed: " . $mail->ErrorInfo);
        return ['success' => false, 'message' => 'Failed to send email: ' . $mail->ErrorInfo];
    }
}

/**
 * Get password reset email template
 */
function getPasswordResetEmailTemplate($otp_code) {
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2B2A29 0%, #5B5B5B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #2B2A29; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #2B2A29; letter-spacing: 8px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Fleet X Parts</h1>
                <p>Password Reset Request</p>
            </div>
            <div class="content">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password. Use the following code to proceed:</p>
                
                <div class="otp-box">
                    <p style="margin: 0; color: #666;">Your Reset Code</p>
                    <div class="otp-code">' . $otp_code . '</div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> This code will expire in <strong>10 minutes</strong>.
                </div>
                
                <p>If you didn\'t request a password reset, please ignore this email and your password will remain unchanged.</p>
                
                <div class="footer">
                    <p>© 2024 Fleet X Parts. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ';
}
?>
