<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\ApiException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Throwable;

class AuthService
{
    public function __construct(
        private string $jwtSecret,
        private string $jwtIssuer,
        private string $jwtAudience,
        private string $jwtExpiresIn,
        private string $authUsername,
        private string $authPassword,
        private string $authRole
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    public function login(array $payload): array
    {
        $username = trim((string) ($payload['username'] ?? ''));
        $password = trim((string) ($payload['password'] ?? ''));

        $errors = [];

        if ($username === '') {
            $errors[] = 'O campo username e obrigatorio.';
        }

        if ($password === '') {
            $errors[] = 'O campo password e obrigatorio.';
        }

        if (!empty($errors)) {
            throw new ApiException(400, 'Falha de validacao.', $errors);
        }

        if (!$this->credentialsMatch($username, $password)) {
            throw new ApiException(401, 'Credenciais invalidas.', []);
        }

        $user = [
            'username' => $this->authUsername,
            'role' => $this->authRole,
        ];

        return [
            'tokenType' => 'Bearer',
            'accessToken' => $this->issueAccessToken($user),
            'expiresIn' => $this->jwtExpiresIn,
            'user' => $user,
        ];
    }

    /**
     * @return array{userId:string, role:string}
     */
    public function verifyAccessToken(string $token): array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
        } catch (Throwable $exception) {
            throw new ApiException(401, 'Token de acesso invalido ou expirado.', []);
        }

        $issuer = (string) ($decoded->iss ?? '');
        $audience = (string) ($decoded->aud ?? '');
        $userId = (string) ($decoded->sub ?? '');
        $role = (string) ($decoded->role ?? '');

        if ($issuer !== $this->jwtIssuer || $audience !== $this->jwtAudience || $userId === '' || $role === '') {
            throw new ApiException(401, 'Token de acesso invalido ou expirado.', []);
        }

        return [
            'userId' => $userId,
            'role' => $role,
        ];
    }

    /**
     * @param array{username:string, role:string} $user
     */
    private function issueAccessToken(array $user): string
    {
        $issuedAt = time();
        $expiresAt = $issuedAt + $this->resolveTtlSeconds($this->jwtExpiresIn);

        return JWT::encode([
            'role' => $user['role'],
            'sub' => $user['username'],
            'iss' => $this->jwtIssuer,
            'aud' => $this->jwtAudience,
            'iat' => $issuedAt,
            'exp' => $expiresAt,
        ], $this->jwtSecret, 'HS256');
    }

    private function credentialsMatch(string $username, string $password): bool
    {
        return $this->safeCompare($username, $this->authUsername)
            && $this->safeCompare($password, $this->authPassword);
    }

    private function safeCompare(string $left, string $right): bool
    {
        if (strlen($left) !== strlen($right)) {
            return false;
        }

        return hash_equals($left, $right);
    }

    private function resolveTtlSeconds(string $expiresIn): int
    {
        $value = trim($expiresIn);

        if (ctype_digit($value)) {
            return max((int) $value, 1);
        }

        if (!preg_match('/^(\d+)\s*([smhd])$/i', $value, $matches)) {
            return 3600;
        }

        $amount = max((int) $matches[1], 1);
        $unit = strtolower((string) $matches[2]);

        return match ($unit) {
            's' => $amount,
            'm' => $amount * 60,
            'h' => $amount * 3600,
            'd' => $amount * 86400,
            default => 3600,
        };
    }
}
