-- Add full_name and phone columns to otp_verification table
ALTER TABLE otp_verification 
ADD COLUMN full_name VARCHAR(255) NULL AFTER password_hash,
ADD COLUMN phone VARCHAR(50) NULL AFTER full_name;
