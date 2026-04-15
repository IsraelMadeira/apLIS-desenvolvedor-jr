<?php

declare(strict_types=1);

namespace App\Models;

use PDO;

class MedicoModel
{
    public function __construct(private PDO $connection)
    {
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function findAll(): array
    {
        $sql = 'SELECT id, nome, crm, uf_crm AS ufCRM, especialidade, created_at AS createdAt, updated_at AS updatedAt FROM medicos ORDER BY id DESC';
        $statement = $this->connection->query($sql);
        return $statement->fetchAll();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function findById(int $id): ?array
    {
        $statement = $this->connection->prepare(
            'SELECT id, nome, crm, uf_crm AS ufCRM, especialidade, created_at AS createdAt, updated_at AS updatedAt FROM medicos WHERE id = :id'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        $result = $statement->fetch();
        return $result === false ? null : $result;
    }

    /**
     * @param array{nome:string, crm:string, ufCRM:string, especialidade:?string} $data
     * @return array<string, mixed>|null
     */
    public function create(array $data): ?array
    {
        $statement = $this->connection->prepare(
            'INSERT INTO medicos (nome, crm, uf_crm, especialidade) VALUES (:nome, :crm, :uf_crm, :especialidade)'
        );

        $statement->bindValue(':nome', $data['nome']);
        $statement->bindValue(':crm', $data['crm']);
        $statement->bindValue(':uf_crm', $data['ufCRM']);
        $statement->bindValue(':especialidade', $data['especialidade']);
        $statement->execute();

        return $this->findById((int) $this->connection->lastInsertId());
    }

    /**
     * @param array{nome:string, crm:string, ufCRM:string, especialidade:?string} $data
     * @return array<string, mixed>|null
     */
    public function update(int $id, array $data): ?array
    {
        $statement = $this->connection->prepare(
            'UPDATE medicos SET nome = :nome, crm = :crm, uf_crm = :uf_crm, especialidade = :especialidade WHERE id = :id'
        );

        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->bindValue(':nome', $data['nome']);
        $statement->bindValue(':crm', $data['crm']);
        $statement->bindValue(':uf_crm', $data['ufCRM']);
        $statement->bindValue(':especialidade', $data['especialidade']);
        $statement->execute();

        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        $statement = $this->connection->prepare('DELETE FROM medicos WHERE id = :id');
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        return $statement->rowCount() > 0;
    }
}
