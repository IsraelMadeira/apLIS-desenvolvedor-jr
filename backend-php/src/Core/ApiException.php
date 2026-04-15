<?php

declare(strict_types=1);

namespace App\Core;

use Exception;

class ApiException extends Exception
{
    /** @var array<int, string> */
    private array $errors;

    /**
     * @param array<int, string> $errors
     */
    public function __construct(int $statusCode, string $message, array $errors = [])
    {
        parent::__construct($message, $statusCode);
        $this->errors = $errors;
    }

    public function getStatusCode(): int
    {
        return $this->getCode();
    }

    /**
     * @return array<int, string>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}
