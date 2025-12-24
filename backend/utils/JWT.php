<?php

class JWT
{
    private $secret;

    public function __construct($secret)
    {
        $this->secret = $secret;
    }

    public function encode($payload)
    {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);

        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }

    public function decode($jwt)
    {
        if (empty($jwt)) {
            return null;
        }

        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) !== 3) {
            return null;
        }

        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
        $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[2]));

        // Verify the signature
        $expectedSignature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], $this->secret, true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $decodedPayload = json_decode($payload, true);

        // Check if token has expired
        if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) {
            return null;
        }

        return $decodedPayload;
    }

    public function isValidToken($jwt)
    {
        return $this->decode($jwt) !== null;
    }
}