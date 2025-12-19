<?php
// Disable HTML error output
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set JSON content type immediately
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/Response.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer via autoload
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
    exit();
}

// Get input from either JSON or FormData
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    // JSON request
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    // FormData request
    $input = $_POST;
}

// Validate required fields
$required_fields = ['fullName', 'email', 'phone', 'subject', 'message'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        Response::error("$field is required", 400);
        exit();
    }
}

// Sanitize input
$fullName = htmlspecialchars(trim($input['fullName']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($input['phone']));
$subject = htmlspecialchars(trim($input['subject']));
$message = htmlspecialchars(trim($input['message']));

// Handle file upload if present
$uploadedFile = null;
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadedFile = $_FILES['file'];
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    Response::error('Invalid email address', 400);
    exit();
}

// Send email to admin
$result = sendContactEmail($fullName, $email, $phone, $subject, $message, $uploadedFile);

if ($result['success']) {
    Response::success('Message sent successfully! We will get back to you within 1 business day.', [
        'sent' => true
    ]);
} else {
    Response::error('Failed to send message. Please try again later.', 500);
}

/**
 * Send contact form email to admin
 */
function sendContactEmail($fullName, $email, $phone, $subject, $message, $uploadedFile = null) {
    // Email configuration for GoDaddy Direct SMTP
    $smtp_host = 'smtpout.secureserver.net';
    $smtp_port = 465;
    $smtp_username = 'sarwan@fleetxusa.com';
    $smtp_password = 'Sarwan2005';
    $from_email = 'sarwan@fleetxusa.com';
    $from_name = 'Fleet X Parts Contact Form';
    $admin_email = 'vikrin48@gmail.com'; // Admin email to receive contact form submissions
    
    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $smtp_port;
        
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        // Recipients
        $mail->setFrom($from_email, $from_name);
        $mail->addAddress($admin_email); // Send to admin
        $mail->addReplyTo($email, $fullName); // Reply-to customer email
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "[FleetX Contact] $subject";
        $mail->Body = getContactEmailTemplate($fullName, $email, $phone, $subject, $message);
        $mail->AltBody = "New Contact Form Submission\n\nName: $fullName\nEmail: $email\nPhone: $phone\nSubject: $subject\n\nMessage:\n$message";
        
        // Attach file if present
        if ($uploadedFile && isset($uploadedFile['tmp_name']) && file_exists($uploadedFile['tmp_name'])) {
            $mail->addAttachment($uploadedFile['tmp_name'], $uploadedFile['name']);
        }
        
        $mail->send();
        
        // Send confirmation email to customer
        sendCustomerConfirmation($email, $fullName, $smtp_host, $smtp_port, $smtp_username, $smtp_password, $from_email);
        
        return ['success' => true, 'message' => 'Email sent successfully'];
    } catch (Exception $e) {
        error_log("Contact form email failed: " . $mail->ErrorInfo);
        return ['success' => false, 'message' => 'Failed to send email: ' . $mail->ErrorInfo];
    }
}

/**
 * Send confirmation email to customer
 */
function sendCustomerConfirmation($email, $fullName, $smtp_host, $smtp_port, $smtp_username, $smtp_password, $from_email) {
    try {
        $mail = new PHPMailer(true);
        
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $smtp_port;
        
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        $mail->setFrom($from_email, 'Fleet X Parts');
        $mail->addAddress($email);
        
        $mail->isHTML(true);
        $mail->Subject = 'Thank you for contacting Fleet X Parts';
        $mail->Body = getCustomerConfirmationTemplate($fullName);
        $mail->AltBody = "Dear $fullName,\n\nThank you for contacting Fleet X Parts. We have received your message and will get back to you within 1 business day.\n\nBest regards,\nFleet X Parts Team";
        
        $mail->send();
    } catch (Exception $e) {
        error_log("Customer confirmation email failed: " . $mail->ErrorInfo);
    }
}

/**
 * Get HTML email template for admin notification
 */
function getContactEmailTemplate($fullName, $email, $phone, $subject, $message) {
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
            .info-row { padding: 10px; border-bottom: 1px solid #ddd; }
            .label { font-weight: bold; color: #2B2A29; }
            .message-box { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
                <div class="info-row">
                    <span class="label">Name:</span> ' . $fullName . '
                </div>
                <div class="info-row">
                    <span class="label">Email:</span> ' . $email . '
                </div>
                <div class="info-row">
                    <span class="label">Phone:</span> ' . $phone . '
                </div>
                <div class="info-row">
                    <span class="label">Subject:</span> ' . $subject . '
                </div>
                <div class="message-box">
                    <p class="label">Message:</p>
                    <p>' . nl2br($message) . '</p>
                </div>
                <div class="footer">
                    <p>Received from Fleet X Parts Contact Form</p>
                    <p>Reply directly to this email to contact the customer</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ';
}

/**
 * Get HTML email template for customer confirmation
 */
function getCustomerConfirmationTemplate($fullName) {
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
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thank You for Contacting Us</h1>
            </div>
            <div class="content">
                <p>Dear ' . $fullName . ',</p>
                <p>Thank you for contacting Fleet X Parts. We have received your message and one of our team members will get back to you within 1 business day.</p>
                <p>If you need immediate assistance, feel free to call us at <strong>917-293-3704</strong> during our business hours (Mon-Fri 9:00 AM - 6:00 PM ET).</p>
                <p>Best regards,<br>Fleet X Parts Team</p>
                <div class="footer">
                    <p>Fleet X Parts | 415 E 31 Street, Anderson, IN 46016</p>
                    <p>Email: support@fleetxusa.com | Phone: 917-293-3704</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ';
}
