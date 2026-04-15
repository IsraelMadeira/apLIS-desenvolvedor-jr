<?php

declare(strict_types=1);

namespace App\Middlewares;

use App\Core\ApiException;
use App\Core\Response;
use Throwable;

class ErrorHandler
{
    public static function handle(Throwable $exception): void
    {
        if ($exception instanceof ApiException) {
            Response::error(
                $exception->getMessage(),
                $exception->getErrors(),
                $exception->getStatusCode()
            );
            return;
        }

        Response::error(
            'Erro interno do servidor.',
            [self::isDevelopment() ? $exception->getMessage() : 'Falha inesperada.'],
            500
        );
    }

    private static function isDevelopment(): bool
    {
        $env = $_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? getenv('APP_ENV') ?: 'production';
        return strtolower((string) $env) === 'development';
    }
}
