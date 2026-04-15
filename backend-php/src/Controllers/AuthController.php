<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\ApiException;
use App\Core\Response;
use App\Services\AuthService;

class AuthController
{
    public function __construct(private AuthService $service)
    {
    }

    /**
     * @param array<string, string> $params
     */
    public function login(array $params = []): void
    {
        unset($params);

        $payload = $this->readJsonBody();
        $authData = $this->service->login($payload);

        Response::success('Autenticacao realizada com sucesso.', $authData);
    }

    /**
     * @return array<string, mixed>
     */
    private function readJsonBody(): array
    {
        $rawBody = file_get_contents('php://input');

        if ($rawBody === false || trim($rawBody) === '') {
            return [];
        }

        $decoded = json_decode($rawBody, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            throw new ApiException(400, 'JSON invalido no corpo da requisicao.', [json_last_error_msg()]);
        }

        return $decoded;
    }
}
