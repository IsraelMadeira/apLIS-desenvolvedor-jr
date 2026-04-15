<?php

declare(strict_types=1);

namespace App\Core;

class Response
{
    /**
     * @param mixed $data
     */
    public static function success(string $message, $data = null, int $statusCode = 200): void
    {
        self::json($statusCode, [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }

    /**
     * @param array<int, string> $errors
     */
    public static function error(string $message, array $errors = [], int $statusCode = 400): void
    {
        self::json($statusCode, [
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ]);
    }

    /**
     * @param array<string, mixed> $payload
     */
    private static function json(int $statusCode, array $payload): void
    {
        http_response_code($statusCode);
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    }
}
