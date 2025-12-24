<?php

require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware
{
    private $jwt;

    public function __construct()
    {
        $this->jwt = new JWT($_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-in-production');
    }

    public function authenticate()
    {
        $headers = $this->getAuthorizationHeader();
        
        if (!$headers) {
            Response::error('Authorization header not found', 401);
            exit();
        }

        $token = null;
        
        // Check for Bearer token format
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            $token = $matches[1];
        }

        if (!$token) {
            Response::error('Token not found', 401);
            exit();
        }

        $payload = $this->jwt->decode($token);
        
        if (!$payload) {
            Response::error('Invalid or expired token', 401);
            exit();
        }

        // Add user data to global scope
        $GLOBALS['current_user'] = $payload;
        
        return $payload;
    }

    public function authenticateOptional()
    {
        $headers = $this->getAuthorizationHeader();
        
        if (!$headers) {
            return null;
        }

        $token = null;
        
        // Check for Bearer token format
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            $token = $matches[1];
        }

        if (!$token) {
            return null;
        }

        $payload = $this->jwt->decode($token);
        
        if ($payload) {
            $GLOBALS['current_user'] = $payload;
        }
        
        return $payload;
    }

    private function getAuthorizationHeader()
    {
        $headers = null;
        
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            
            // Server-side fix for bug in old Android versions
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)), 
                array_values($requestHeaders)
            );
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        return $headers;
    }

    public function getCurrentUser()
    {
        return $GLOBALS['current_user'] ?? null;
    }
}