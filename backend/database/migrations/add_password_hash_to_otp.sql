-- Add password_hash column to otp_verification table for pending registrations
ALTER TABLE otp_verification 
ADD COLUMN password_hash VARCHAR(255) NULL AFTER attempts;
