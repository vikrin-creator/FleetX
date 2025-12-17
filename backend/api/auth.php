<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../utils/otp.php';
    require_once __DIR__ . '/../utils/email-smtp.php';
    require_once __DIR__ . '/../utils/Response.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'File loading error: ' . $e->getMessage()]);
    exit();
}

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
    case 'forgot_password':
        handleForgotPassword();
        break;
    case 'verify_reset_otp':
        handleVerifyResetOTP();
        break;
    case 'reset_password':
        handleResetPassword();
        break;
    default:
        Response::error('Invalid action', 400);
}

/**
 * Handle user registration
 */
function handleRegister() {
    $rawInput = file_get_contents('php://input');
    error_log("Raw input: " . $rawInput);
    
    $data = json_decode($rawInput, true);
    error_log("Decoded data: " . print_r($data, true));
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $password = $data['password'] ?? '';
    
    error_log("Email: " . $email . ", Password length: " . strlen($password));
    
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
        
        // Check if email already exists and is verified
        $stmt = $db->prepare("SELECT id, email_verified FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $existingUser = $stmt->fetch();
        
        if ($existingUser && $existingUser['email_verified'] == 1) {
            Response::error('Email already registered', 400);
            return;
        }
        
        // Hash password but don't create user yet
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Generate and send OTP (store password with it)
        $otp_code = generateOTP();
        storeOTP($email, $otp_code, $hashedPassword);
        $emailResult = sendOTPEmail($email, $otp_code);
        
        if (!$emailResult['success']) {
            Response::error('Failed to send verification email. Please try again.', 500);
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

/**
 * Handle forgot password
 */
function handleForgotPassword() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    
    if (!$email) {
        echo json_encode(['success' => false, 'message' => 'Email is required']);
        return;
    }
    
    try {
        $db = Database::getInstance()->getConnection();
        
        // Check if user exists
        $stmt = $db->prepare("SELECT id, email_verified FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Always show success message for security (don't reveal if email exists)
        if (!$user) {
            echo json_encode([
                'success' => true,
                'message' => 'If an account exists with this email, you will receive password reset instructions.'
            ]);
            return;
        }
        
        // Generate OTP for password reset
        $otp_code = generateOTP();
        storeOTP($email, $otp_code);
        $emailResult = sendPasswordResetEmail($email, $otp_code);
        
        if (!$emailResult['success']) {
            echo json_encode(['success' => false, 'message' => 'Failed to send reset email']);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'If an account exists with this email, you will receive password reset instructions.'
        ]);
        
    } catch (Exception $e) {
        error_log("Forgot password error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to process request']);
    }
}

/**
 * Handle password reset OTP verification
 */
function handleVerifyResetOTP() {
    try {
        $db = getDBConnection();
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
            return;
        }
        
        $email = trim($input['email'] ?? '');
        $otp = trim($input['otp'] ?? '');
        
        if (empty($email) || empty($otp)) {
            echo json_encode(['success' => false, 'message' => 'Email and OTP are required']);
            return;
        }
        
        // Verify user exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Invalid request']);
            return;
        }
        
        // Verify OTP
        if (!verifyOTP($email, $otp)) {
            echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP']);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'OTP verified successfully'
        ]);
        
    } catch (Exception $e) {
        error_log("Verify reset OTP error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to verify OTP']);
    }
}

/**
 * Handle password reset
 */
function handleResetPassword() {
    try {
        $db = getDBConnection();
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
            return;
        }
        
        $email = trim($input['email'] ?? '');
        $otp = trim($input['otp'] ?? '');
        $newPassword = trim($input['new_password'] ?? '');
        
        if (empty($email) || empty($otp) || empty($newPassword)) {
            echo json_encode(['success' => false, 'message' => 'All fields are required']);
            return;
        }
        
        if (strlen($newPassword) < 6) {
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
            return;
        }
        
        // Verify user exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Invalid request']);
            return;
        }
        
        // Verify OTP one final time
        if (!verifyOTP($email, $otp)) {
            echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP']);
            return;
        }
        
        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        // Update password
        $stmt = $db->prepare("UPDATE users SET password = ? WHERE email = ?");
        if (!$stmt->execute([$hashedPassword, $email])) {
            echo json_encode(['success' => false, 'message' => 'Failed to update password']);
            return;
        }
        
        // Clear the OTP after successful password reset
        clearOTP($email);
        
        echo json_encode([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
        
    } catch (Exception $e) {
        error_log("Reset password error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Failed to reset password']);
    }
}
?>
