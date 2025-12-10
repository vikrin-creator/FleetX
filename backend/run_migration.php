<?php
require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    echo "Running migration: Add password_hash to otp_verification\n";
    
    // Check if column already exists
    $checkStmt = $db->query("SHOW COLUMNS FROM otp_verification LIKE 'password_hash'");
    
    if ($checkStmt->rowCount() > 0) {
        echo "Column 'password_hash' already exists. Skipping migration.\n";
    } else {
        // Run migration
        $sql = file_get_contents(__DIR__ . '/../database/migrations/add_password_hash_to_otp.sql');
        $db->exec($sql);
        echo "Migration completed successfully!\n";
    }
    
    echo "\nNow you need to clean up any unverified users:\n";
    echo "Run this SQL manually if needed:\n";
    echo "DELETE FROM users WHERE email_verified = 0;\n";
    
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
