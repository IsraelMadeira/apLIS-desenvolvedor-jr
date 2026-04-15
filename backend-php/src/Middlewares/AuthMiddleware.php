<?php

declare(strict_types=1);

namespace App\Middlewares;

use App\Core\ApiException;
use App\Services\AuthService;

class AuthMiddleware
{
    public function __construct(private AuthService $authService)
    {
    }

    public function authenticate(callable $handler): callable
    {
        return function (array $params = []) use ($handler): void {
            $this->resolveAuthenticatedUser();
            call_user_func($handler, $params);
        };
    }

    /**
     * @param array<int, string> $allowedRoles
     */
    public function requireRole(array $allowedRoles, callable $handler): callable
    {
        return function (array $params = []) use ($allowedRoles, $handler): void {
            $auth = $this->resolveAuthenticatedUser();

            if (!in_array($auth['role'], $allowedRoles, true)) {
                throw new ApiException(403, 'Usuario sem permissao para este recurso.', []);
            }

            call_user_func($handler, $params);
        };
    }

    /**
     * @return array{userId:string, role:string}
     */
    private function resolveAuthenticatedUser(): array
    {
        $authorizationHeader = $this->resolveAuthorizationHeader();

        if ($authorizationHeader === null) {
            throw new ApiException(401, 'Token de acesso ausente.', []);
        }

        $token = $this->extractBearerToken($authorizationHeader);

        if ($token === null) {
            throw new ApiException(401, 'Token de acesso ausente.', []);
        }

        $auth = $this->authService->verifyAccessToken($token);

        $_SERVER['AUTH_USER_ID'] = $auth['userId'];
        $_SERVER['AUTH_ROLE'] = $auth['role'];

        return $auth;
    }

    private function resolveAuthorizationHeader(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? null;

        if (is_string($header) && trim($header) !== '') {
            return $header;
        }

        if (!function_exists('getallheaders')) {
            return null;
        }

        $headers = getallheaders();

        if (!is_array($headers)) {
            return null;
        }

        foreach ($headers as $key => $value) {
            if (strcasecmp((string) $key, 'Authorization') === 0 && is_string($value) && trim($value) !== '') {
                return $value;
            }
        }

        return null;
    }

    private function extractBearerToken(string $authorizationHeader): ?string
    {
        $parts = preg_split('/\s+/', trim($authorizationHeader));

        if (!is_array($parts) || count($parts) < 2) {
            return null;
        }

        if (strcasecmp((string) $parts[0], 'Bearer') !== 0) {
            return null;
        }

        $token = trim((string) $parts[1]);

        if ($token === '') {
            return null;
        }

        return $token;
    }
}
