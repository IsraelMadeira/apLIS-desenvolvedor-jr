<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\ApiException;
use App\Models\MedicoModel;
use PDOException;

class MedicoService
{
    public function __construct(private MedicoModel $model)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listMedicos(): array
    {
        return $this->model->findAll();
    }

    /**
     * @return array<string, mixed>
     */
    public function getMedicoById(string $id): array
    {
        $parsedId = $this->parseId($id);
        $medico = $this->model->findById($parsedId);

        if ($medico === null) {
            throw new ApiException(404, 'Medico nao encontrado.', []);
        }

        return $medico;
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>|null
     */
    public function createMedico(array $payload): ?array
    {
        $data = $this->validatePayload($payload);

        try {
            return $this->model->create($data);
        } catch (PDOException $exception) {
            $this->handleIntegrityViolation($exception);
            throw $exception;
        }
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<string, mixed>|null
     */
    public function updateMedico(string $id, array $payload): ?array
    {
        $parsedId = $this->parseId($id);
        $existing = $this->model->findById($parsedId);

        if ($existing === null) {
            throw new ApiException(404, 'Medico nao encontrado.', []);
        }

        $data = $this->validatePayload($payload);

        try {
            return $this->model->update($parsedId, $data);
        } catch (PDOException $exception) {
            $this->handleIntegrityViolation($exception);
            throw $exception;
        }
    }

    public function deleteMedico(string $id): void
    {
        $parsedId = $this->parseId($id);
        $removed = $this->model->delete($parsedId);

        if (!$removed) {
            throw new ApiException(404, 'Medico nao encontrado.', []);
        }
    }

    /**
     * @param array<string, mixed> $payload
     * @return array{nome:string, crm:string, ufCRM:string, especialidade:?string}
     */
    private function validatePayload(array $payload): array
    {
        $errors = [];

        $nome = trim((string) ($payload['nome'] ?? ''));
        $crm = trim((string) ($payload['crm'] ?? ''));
        $ufCRM = strtoupper(trim((string) ($payload['ufCRM'] ?? $payload['uf_crm'] ?? '')));
        $especialidade = isset($payload['especialidade']) ? trim((string) $payload['especialidade']) : null;
        $especialidade = $especialidade === '' ? null : $especialidade;

        if ($nome === '') {
            $errors[] = 'O campo nome e obrigatorio.';
        }

        if ($crm === '') {
            $errors[] = 'O campo crm e obrigatorio.';
        }

        if ($ufCRM === '' || strlen($ufCRM) !== 2) {
            $errors[] = 'O campo ufCRM e obrigatorio e deve conter 2 caracteres.';
        }

        if (!empty($errors)) {
            throw new ApiException(400, 'Falha de validacao.', $errors);
        }

        return [
            'nome' => $nome,
            'crm' => $crm,
            'ufCRM' => $ufCRM,
            'especialidade' => $especialidade,
        ];
    }

    private function parseId(string $id): int
    {
        if (!ctype_digit($id) || (int) $id <= 0) {
            throw new ApiException(400, 'Parametro invalido.', ['O campo id deve ser um inteiro positivo.']);
        }

        return (int) $id;
    }

    private function handleIntegrityViolation(PDOException $exception): void
    {
        if ($exception->getCode() !== '23000') {
            return;
        }

        $message = $exception->getMessage();

        if (str_contains($message, 'uq_medicos_crm_uf')) {
            throw new ApiException(409, 'Conflito de dados.', ['Ja existe medico com o mesmo CRM/UF.']);
        }

        throw new ApiException(409, 'Conflito de dados.', ['Ja existe um registro com os dados informados.']);
    }
}
