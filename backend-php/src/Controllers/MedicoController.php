<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\ApiException;
use App\Core\Response;
use App\Services\MedicoService;

class MedicoController
{
    public function __construct(private MedicoService $service)
    {
    }

    /**
     * @param array<string, string> $params
     */
    public function list(array $params = []): void
    {
        unset($params);

        $medicos = $this->service->listMedicos();
        Response::success('Medicos listados com sucesso.', $medicos);
    }

    /**
     * @param array<string, string> $params
     */
    public function getById(array $params): void
    {
        $medico = $this->service->getMedicoById((string) ($params['id'] ?? ''));
        Response::success('Medico encontrado com sucesso.', $medico);
    }

    /**
     * @param array<string, string> $params
     */
    public function create(array $params = []): void
    {
        unset($params);

        $payload = $this->readJsonBody();
        $medico = $this->service->createMedico($payload);
        Response::success('Medico criado com sucesso.', $medico, 201);
    }

    /**
     * @param array<string, string> $params
     */
    public function update(array $params): void
    {
        $payload = $this->readJsonBody();
        $medico = $this->service->updateMedico((string) ($params['id'] ?? ''), $payload);
        Response::success('Medico atualizado com sucesso.', $medico);
    }

    /**
     * @param array<string, string> $params
     */
    public function delete(array $params): void
    {
        $this->service->deleteMedico((string) ($params['id'] ?? ''));
        Response::success('Medico removido com sucesso.', null);
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
