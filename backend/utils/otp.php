<?php
require_once __DIR__ . '/../config/database.php';

/**
 * Generate a 6-digit OTP code
 */
function generateOTP() {
    return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

/**
 * Store OTP in database with optional password, name, and phone for registration
 */
function storeOTP($email, $otp_code, $password_hash = null, $fullName = null, $phone = null) {
    $db = Database::getInstance()->getConnection();
    
    // Delete any existing OTPs for this email
    $deleteStmt = $db->prepare("DELETE FROM otp_verification WHERE email = ?");
    $deleteStmt->execute([$email]);
    
    // Calculate expiration time (10 minutes from now)
    $expires_at = date('Y-m-d H:i:s', strtotime('+10 minutes'));
    
    // Check if password_hash column exists, if not use old version
    try {
        $insertStmt = $db->prepare("
            INSERT INTO otp_verification (email, otp_code, expires_at, verified, attempts, password_hash, full_name, phone) 
            VALUES (?, ?, ?, 0, 0, ?, ?, ?)
        ");
        return $insertStmt->execute([$email, $otp_code, $expires_at, $password_hash, $fullName, $phone]);
    } catch (PDOException $e) {
        // Fallback for tables without new columns - try with just password_hash
        try {
            $insertStmt = $db->prepare("
                INSERT INTO otp_verification (email, otp_code, expires_at, verified, attempts, password_hash) 
                VALUES (?, ?, ?, 0, 0, ?)
            ");
            return $insertStmt->execute([$email, $otp_code, $expires_at, $password_hash]);
        } catch (PDOException $e2) {
            // Fallback for tables without password_hash column
            $insertStmt = $db->prepare("
                INSERT INTO otp_verification (email, otp_code, expires_at, verified, attempts) 
                VALUES (?, ?, ?, 0, 0)
            ");
            return $insertStmt->execute([$email, $otp_code, $expires_at]);
        }
    }
}

/**
 * Verify OTP code
 */
function verifyOTP($email, $otp_code) {
    $db = Database::getInstance()->getConnection();
    
    // Get OTP record
    $stmt = $db->prepare("
        SELECT * FROM otp_verification 
        WHERE email = ? AND otp_code = ? AND verified = 0
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->execute([$email, $otp_code]);
    $record = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$record) {
        return ['success' => false, 'message' => 'Invalid OTP code'];
    }
    
    // Check if already verified
    if ($record['verified'] == 1) {
        return ['success' => false, 'message' => 'OTP already used'];
    }
    
    // Check expiration
    if (strtotime($record['expires_at']) < time()) {
        return ['success' => false, 'message' => 'OTP has expired. Please request a new one'];
    }
    
    // Check attempts
    if ($record['attempts'] >= 5) {
        return ['success' => false, 'message' => 'Too many failed attempts. Please request a new OTP'];
    }
    
    // Mark as verified
    $updateStmt = $db->prepare("
        UPDATE otp_verification 
        SET verified = 1 
        WHERE id = ?
    ");
    $updateStmt->execute([$record['id']]);
    
    // If password_hash exists in OTP record, this is a new registration
    if (isset($record['password_hash']) && !empty($record['password_hash'])) {
        // Check if user already exists
        $checkStmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $checkStmt->execute([$email]);
        
        if (!$checkStmt->fetch()) {
            // Create the user account with name and phone
            $fullName = $record['full_name'] ?? null;
            $phone = $record['phone'] ?? null;
            
            $createStmt = $db->prepare("
                INSERT INTO users (email, password, name, phone, email_verified) 
                VALUES (?, ?, ?, ?, 1)
            ");
            $createStmt->execute([$email, $record['password_hash'], $fullName, $phone]);
        }
    } else {
        // Mark email as verified in existing users table
        $userStmt = $db->prepare("
            UPDATE users 
            SET email_verified = 1 
            WHERE email = ?
        ");
        $userStmt->execute([$email]);
    }
    
    return ['success' => true, 'message' => 'Email verified successfully'];
}

/**
 * Increment failed OTP attempt
 */
function incrementOTPAttempt($email) {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        UPDATE otp_verification 
        SET attempts = attempts + 1 
        WHERE email = ? AND verified = 0
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    
    return $stmt->execute([$email]);
}

/**
 * Clean up expired OTPs (can be called periodically)
 */
function cleanupExpiredOTPs() {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("
        DELETE FROM otp_verification 
        WHERE expires_at < NOW() OR (verified = 1 AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY))
    ");
    
    return $stmt->execute();
}

/**
 * Clear/Delete OTP for a specific email
 */
function clearOTP($email) {
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("DELETE FROM otp_verification WHERE email = ?");
    return $stmt->execute([$email]);
}
?>
