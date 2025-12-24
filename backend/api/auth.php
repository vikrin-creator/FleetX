<?php
// Disable error display for production (prevents HTML in JSON responses)
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// JWT Configuration constants
define('JWT_SECRET', 'fleetx-super-secret-jwt-key-change-in-production-2024-secure');
define('JWT_EXPIRE_TIME', 24 * 60 * 60); // 24 hours
define('JWT_REFRESH_TIME', 7 * 24 * 60 * 60); // 7 days

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../utils/otp.php';
    require_once __DIR__ . '/../utils/email-smtp.php';
    require_once __DIR__ . '/../utils/Response.php';
    
    // Include JWT files if they exist, otherwise define inline
    if (file_exists(__DIR__ . '/../utils/JWT.php')) {
        require_once __DIR__ . '/../utils/JWT.php';
    } else {
        // Inline JWT class definition
        class JWT {
            private $secret;
            public function __construct($secret) { $this->secret = $secret; }
            public function encode($payload) {
                $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
                $payload = json_encode($payload);
                $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
                $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
                $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret, true);
                $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
                return $base64Header . "." . $base64Payload . "." . $base64Signature;
            }
            public function decode($jwt) {
                if (empty($jwt)) return null;
                $tokenParts = explode('.', $jwt);
                if (count($tokenParts) !== 3) return null;
                $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[2]));
                $expectedSignature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], $this->secret, true);
                if (!hash_equals($expectedSignature, $signature)) return null;
                $decodedPayload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1])), true);
                if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) return null;
                return $decodedPayload;
            }
        }
    }
    
    if (file_exists(__DIR__ . '/../middleware/AuthMiddleware.php')) {
        require_once __DIR__ . '/../middleware/AuthMiddleware.php';
    } else {
        // Inline AuthMiddleware class definition
        class AuthMiddleware {
            private $jwt;
            public function __construct() { $this->jwt = new JWT(JWT_SECRET); }
            public function authenticate() {
                $headers = $this->getAuthorizationHeader();
                if (!$headers) { Response::error('Authorization header not found', 401); exit(); }
                $token = null;
                if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) { $token = $matches[1]; }
                if (!$token) { Response::error('Token not found', 401); exit(); }
                $payload = $this->jwt->decode($token);
                if (!$payload) { Response::error('Invalid or expired token', 401); exit(); }
                $GLOBALS['current_user'] = $payload;
                return $payload;
            }
            private function getAuthorizationHeader() {
                if (isset($_SERVER['Authorization'])) return trim($_SERVER["Authorization"]);
                if (isset($_SERVER['HTTP_AUTHORIZATION'])) return trim($_SERVER["HTTP_AUTHORIZATION"]);
                if (function_exists('apache_request_headers')) {
                    $requestHeaders = apache_request_headers();
                    $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
                    if (isset($requestHeaders['Authorization'])) return trim($requestHeaders['Authorization']);
                }
                return null;
            }
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
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
    case 'refresh_token':
        handleRefreshToken();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'verify_token':
        handleVerifyToken();
        break;
    case 'profile':
        handleProfile();
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
    $fullName = trim($data['fullName'] ?? '');
    $phone = trim($data['phone'] ?? '');
    
    error_log("Email: " . $email . ", Password length: " . strlen($password));
    
    if (!$email || !$password) {
        Response::error('Email and password are required', 400);
        return;
    }
    
    if (!$fullName || !$phone) {
        Response::error('Full name and phone number are required', 400);
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
        
        // Generate and send OTP (store password, name, phone with it)
        $otp_code = generateOTP();
        storeOTP($email, $otp_code, $hashedPassword, $fullName, $phone);
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
        
        // Successful login - generate JWT token
        $jwt = new JWT(JWT_SECRET);
        
        $payload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'iat' => time(),
            'exp' => time() + JWT_EXPIRE_TIME
        ];
        
        $token = $jwt->encode($payload);
        
        // Also generate refresh token
        $refreshPayload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'type' => 'refresh',
            'iat' => time(),
            'exp' => time() + JWT_REFRESH_TIME
        ];
        
        $refreshToken = $jwt->encode($refreshPayload);
        
        Response::success([
            'message' => 'Login successful',
            'token' => $token,
            'refresh_token' => $refreshToken,
            'expires_in' => JWT_EXPIRE_TIME,
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
        
        // Start session for the user and generate JWT tokens
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $jwt = new JWT(JWT_SECRET);
        
        $payload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'iat' => time(),
            'exp' => time() + JWT_EXPIRE_TIME
        ];
        
        $token = $jwt->encode($payload);
        
        // Also generate refresh token
        $refreshPayload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'type' => 'refresh',
            'iat' => time(),
            'exp' => time() + JWT_REFRESH_TIME
        ];
        
        $refreshToken = $jwt->encode($refreshPayload);
        
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        
        Response::success([
            'message' => 'Email verified successfully! You are now logged in.',
            'token' => $token,
            'refresh_token' => $refreshToken,
            'expires_in' => JWT_EXPIRE_TIME,
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
        echo json_encode(['success' => false, 'message' => 'Valid email is required']);
        return;
    }
    
    // Use the EXACT same approach as registration (which works)
    $otp_code = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    
    // Use the same sendOTPEmail function that works for registration
    $emailResult = sendOTPEmail($email, $otp_code);
    
    if ($emailResult['success']) {
        echo json_encode([
            'success' => true,
            'message' => 'Password reset code sent! Check your inbox.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to send reset email. Please try again.'
        ]);
    }
}

/**
 * Create OTP verification table if it doesn't exist
 */
function createOTPTableIfNotExists($db) {
    try {
        $sql = "CREATE TABLE IF NOT EXISTS otp_verification (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp_code VARCHAR(6) NOT NULL,
            expires_at DATETIME NOT NULL,
            verified TINYINT(1) DEFAULT 0,
            verified_at DATETIME NULL,
            attempts INT DEFAULT 0,
            password_hash VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email_otp (email, otp_code),
            INDEX idx_expires_at (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->exec($sql);
        return true;
    } catch (Exception $e) {
        error_log("Failed to create OTP table: " . $e->getMessage());
        return false;
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

/**
 * Handle JWT token refresh
 */
function handleRefreshToken() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $refreshToken = $data['refresh_token'] ?? '';
    
    if (!$refreshToken) {
        Response::error('Refresh token is required', 400);
        return;
    }
    
    try {
        $jwt = new JWT(JWT_SECRET);
        $payload = $jwt->decode($refreshToken);
        
        if (!$payload || $payload['type'] !== 'refresh') {
            Response::error('Invalid refresh token', 401);
            return;
        }
        
        // Generate new access token
        $newPayload = [
            'user_id' => $payload['user_id'],
            'email' => $payload['email'],
            'iat' => time(),
            'exp' => time() + JWT_EXPIRE_TIME
        ];
        
        $newToken = $jwt->encode($newPayload);
        
        Response::success([
            'message' => 'Token refreshed successfully',
            'token' => $newToken,
            'expires_in' => JWT_EXPIRE_TIME
        ]);
        
    } catch (Exception $e) {
        error_log("Token refresh error: " . $e->getMessage());
        Response::error('Failed to refresh token', 500);
    }
}

/**
 * Handle logout (JWT - mainly for cleanup)
 */
function handleLogout() {
    // For JWT, we mainly just need to clear server-side sessions if any
    // Client will handle token removal
    session_start();
    session_destroy();
    
    Response::success([
        'message' => 'Logged out successfully'
    ]);
}

/**
 * Handle token verification
 */
function handleVerifyToken() {
    $authMiddleware = new AuthMiddleware();
    
    try {
        $user = $authMiddleware->authenticate();
        
        // Get full user details from database
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT id, email, email_verified, created_at FROM users WHERE id = ?");
        $stmt->execute([$user['user_id']]);
        $userDetails = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$userDetails) {
            Response::error('User not found', 404);
            return;
        }
        
        Response::success([
            'message' => 'Token is valid',
            'user' => [
                'id' => $userDetails['id'],
                'email' => $userDetails['email'],
                'email_verified' => (bool)$userDetails['email_verified'],
                'created_at' => $userDetails['created_at']
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Token verification error: " . $e->getMessage());
        Response::error('Token verification failed', 401);
    }
}

/**
 * Handle profile fetch
 */
function handleProfile() {
    $authMiddleware = new AuthMiddleware();
    
    try {
        $user = $authMiddleware->authenticate();
        
        // Get full user profile from database
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            SELECT id, email, full_name, phone, email_verified, created_at, updated_at 
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$user['user_id']]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$profile) {
            Response::error('Profile not found', 404);
            return;
        }
        
        Response::success([
            'message' => 'Profile retrieved successfully',
            'profile' => [
                'id' => $profile['id'],
                'email' => $profile['email'],
                'full_name' => $profile['full_name'],
                'phone' => $profile['phone'],
                'email_verified' => (bool)$profile['email_verified'],
                'created_at' => $profile['created_at'],
                'updated_at' => $profile['updated_at']
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Profile fetch error: " . $e->getMessage());
        Response::error('Failed to fetch profile', 500);
    }
}
?>
