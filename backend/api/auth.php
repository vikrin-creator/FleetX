<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/otp.php';
require_once __DIR__ . '/../utils/email-smtp.php';
require_once __DIR__ . '/../utils/Response.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        handleRegister();
        break;
    case 'login':
        handleLogin();
        break;
    case 'verify_otp':
        handleVerifyOTP();
        break;
    case 'resend_otp':
        handleResendOTP();
        break;
    default:
        Response::error('Invalid action', 400);
}

/**
 * Handle user registration
 */
function handleRegister() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $password = $data['password'] ?? '';
    
    if (!$email || !$password) {
        Response::error('Email and password are required', 400);
        return;
    }
    
    if (strlen($password) < 6) {
        Response::error('Password must be at least 6 characters', 400);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        // Check if email already exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            Response::error('Email already registered', 400);
            return;
        }
        
        // Create user account
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $insertStmt = $db->prepare("
            INSERT INTO users (email, password, email_verified) 
            VALUES (?, ?, 0)
        ");
        $insertStmt->execute([$email, $hashedPassword]);
        
        // Generate and send OTP
        $otp_code = generateOTP();
        storeOTP($email, $otp_code);
        $emailResult = sendOTPEmail($email, $otp_code);
        
        if (!$emailResult['success']) {
            Response::error('Account created but failed to send verification email', 500);
            return;
        }
        
        Response::success([
            'message' => 'Registration successful! Please check your email for the verification code.',
            'requiresOTP' => true,
            'email' => $email
        ]);
        
    } catch (PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        Response::error('Registration failed', 500);
    }
}

/**
 * Handle user login
 */
function handleLogin() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $password = $data['password'] ?? '';
    
    if (!$email || !$password) {
        Response::error('Email and password are required', 400);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        // Get user
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('Invalid email or password', 401);
            return;
        }
        
        // Check if email is verified
        if ($user['email_verified'] == 0) {
            // Send new OTP
            $otp_code = generateOTP();
            storeOTP($email, $otp_code);
            sendOTPEmail($email, $otp_code);
            
            Response::success([
                'message' => 'Email not verified. A new verification code has been sent.',
                'requiresOTP' => true,
                'email' => $email
            ]);
            return;
        }
        
        // Successful login
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        
        Response::success([
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'email_verified' => (bool)$user['email_verified']
            ]
        ]);
        
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        Response::error('Login failed', 500);
    }
}

/**
 * Handle OTP verification
 */
function handleVerifyOTP() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $otp_code = $data['otp_code'] ?? '';
    
    if (!$email || !$otp_code) {
        Response::error('Email and OTP code are required', 400);
        return;
    }
    
    try {
        $result = verifyOTP($email, $otp_code);
        
        if (!$result['success']) {
            // Increment failed attempts
            incrementOTPAttempt($email);
            Response::error($result['message'], 400);
            return;
        }
        
        // Start session for the user
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        
        Response::success([
            'message' => 'Email verified successfully! You can now log in.',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'email_verified' => true
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("OTP verification error: " . $e->getMessage());
        Response::error('Verification failed', 500);
    }
}

/**
 * Handle resend OTP
 */
function handleResendOTP() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    
    if (!$email) {
        Response::error('Email is required', 400);
        return;
    }
    
    try {
        // Generate and send new OTP
        $otp_code = generateOTP();
        storeOTP($email, $otp_code);
        $emailResult = sendOTPEmail($email, $otp_code);
        
        if (!$emailResult['success']) {
            Response::error('Failed to send verification email', 500);
            return;
        }
        
        Response::success([
            'message' => 'A new verification code has been sent to your email'
        ]);
        
    } catch (Exception $e) {
        error_log("Resend OTP error: " . $e->getMessage());
        Response::error('Failed to resend OTP', 500);
    }
}
?>
