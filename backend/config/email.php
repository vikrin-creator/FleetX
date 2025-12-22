<?php
/**
 * Email Configuration
 * SMTP settings for sending emails
 */

return [
    'smtp_host' => 'smtpout.secureserver.net',
    'smtp_port' => 465,
    'smtp_username' => 'sarwan@fleetxusa.com',
    'smtp_password' => 'Sarwan2005',
    'smtp_secure' => PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS,
    'from_email' => 'sarwan@fleetxusa.com',
    'from_name' => 'Fleet X Parts',
    'reply_to' => 'sarwan@fleetxusa.com'
];
