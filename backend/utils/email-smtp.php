<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer via autoload
require_once __DIR__ . '/../vendor/autoload.php';

/**
 * Send email using SMTP
 */
function sendEmail($to, $subject, $htmlBody, $textBody = '') {
    $config = require __DIR__ . '/../config/email.php';
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'];
        $mail->Password = $config['smtp_password'];
        $mail->SMTPSecure = $config['smtp_secure'];
        $mail->Port = $config['smtp_port'];
        
        // Additional SMTP settings for better deliverability
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        // Recipients
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($to);
        $mail->addReplyTo($config['reply_to'], $config['from_name']);
        
        // Anti-spam headers
        $mail->addCustomHeader('X-Mailer', 'PHPMailer');
        $mail->addCustomHeader('X-Priority', '3');
        $mail->addCustomHeader('X-MSMail-Priority', 'Normal');
        $mail->addCustomHeader('List-Unsubscribe', '<mailto:' . $config['from_email'] . '>');
        $mail->addCustomHeader('Precedence', 'bulk');
        $mail->Sender = $config['from_email'];
        
        // Content
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $textBody ?: strip_tags($htmlBody);
        
        $mail->send();
        return ['success' => true, 'message' => 'Email sent successfully'];
    } catch (Exception $e) {
        error_log("Email send failed: {$mail->ErrorInfo}");
        return ['success' => false, 'message' => 'Failed to send email: ' . $mail->ErrorInfo];
    }
}

/**
 * Send OTP email using SMTP
 */
function sendOTPEmail($email, $otp_code) {
    $subject = '[Fleet X Parts] Email Verification Code';
    
    $htmlBody = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
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
    </html>';
    
    $textBody = "Your Fleet X verification code is: $otp_code\n\nThis code will expire in 10 minutes.";
    
    return sendEmail($email, $subject, $htmlBody, $textBody);
}

/**
 * Send password reset email
 */
function sendPasswordResetEmail($email, $otp_code) {
    $subject = '[Fleet X Parts] Password Reset Request';
    
    $htmlBody = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2B2A29 0%, #5B5B5B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #dc3545; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #dc3545; letter-spacing: 8px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #f8d7da; border-left: 4px solid #dc3545; padding: 12px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Fleet X Parts</h1>
                <p>Password Reset</p>
            </div>
            <div class="content">
                <h2>Password Reset Request</h2>
                <p>You recently requested to reset your password. Use the following code to complete the process:</p>
                
                <div class="otp-box">
                    <p style="margin: 0; color: #666;">Your Reset Code</p>
                    <div class="otp-code">' . $otp_code . '</div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> This code will expire in <strong>10 minutes</strong>.
                </div>
                
                <p>If you didn\'t request this password reset, please ignore this email or contact our support team immediately.</p>
                
                <div class="footer">
                    <p>© 2024 Fleet X Parts. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </div>
    </body>
    </html>';
    
    $textBody = "Your Fleet X password reset code is: $otp_code\n\nThis code will expire in 10 minutes.\nIf you didn't request this, please ignore this email.";
    
    return sendEmail($email, $subject, $htmlBody, $textBody);
}
?>
