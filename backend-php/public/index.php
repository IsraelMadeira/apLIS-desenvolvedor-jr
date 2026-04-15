<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\MedicoController;
use App\Core\Database;
use App\Core\Response;
use App\Core\Router;
use App\Middlewares\AuthMiddleware;
use App\Middlewares\ErrorHandler;
use App\Models\MedicoModel;
use App\Services\AuthService;
use App\Services\MedicoService;

require __DIR__ . '/../vendor/autoload.php';

if (class_exists(\Dotenv\Dotenv::class)) {
    $dotenv = \Dotenv\Dotenv::createImmutable(dirname(__DIR__));
    $dotenv->safeLoad();
}

function envValue(string $key, string $default): string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

    if ($value === false || $value === null || $value === '') {
        return $default;
    }

    return (string) $value;
}

$corsOrigin = envValue('PHP_CORS_ORIGIN', 'http://localhost:5173');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $corsOrigin);
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

set_exception_handler([ErrorHandler::class, 'handle']);

$defaultJwtSecret = 'change_me_super_secret';
$defaultAuthUsername = 'admin';
$defaultAuthPassword = 'admin123';

$appEnv = strtolower(envValue('APP_ENV', 'development'));
$jwtSecret = envValue('JWT_SECRET', $defaultJwtSecret);
$jwtIssuer = envValue('JWT_ISSUER', 'clinica-devjr-node');
$jwtAudience = envValue('JWT_AUDIENCE', 'clinica-devjr-frontend');
$jwtExpiresIn = envValue('JWT_EXPIRES_IN', '1h');
$authUsername = envValue('AUTH_USERNAME', $defaultAuthUsername);
$authPassword = envValue('AUTH_PASSWORD', $defaultAuthPassword);
$authRole = envValue('AUTH_ROLE', 'admin');

if ($appEnv === 'production') {
    if ($jwtSecret === $defaultJwtSecret) {
        throw new RuntimeException('JWT_SECRET deve ser configurado para ambiente de producao.');
    }

    if ($authUsername === $defaultAuthUsername && $authPassword === $defaultAuthPassword) {
        throw new RuntimeException('AUTH_USERNAME e AUTH_PASSWORD nao podem usar valores padrao em producao.');
    }
}

if ($jwtSecret === $defaultJwtSecret) {
    error_log('JWT_SECRET padrao em uso. Configure JWT_SECRET em backend-php/.env.');
}

if ($authUsername === $defaultAuthUsername && $authPassword === $defaultAuthPassword) {
    error_log('Credenciais padrao em uso (AUTH_USERNAME/AUTH_PASSWORD). Configure backend-php/.env.');
}

$authService = new AuthService(
    $jwtSecret,
    $jwtIssuer,
    $jwtAudience,
    $jwtExpiresIn,
    $authUsername,
    $authPassword,
    $authRole
);

$authController = new AuthController($authService);
$authMiddleware = new AuthMiddleware($authService);

$medicoController = new MedicoController(
    new MedicoService(
        new MedicoModel(Database::getConnection())
    )
);

$router = new Router();

$router->add('GET', '/health', function (): void {
    Response::success(
        'PHP API de medicos operacional.',
        [
            'service' => 'backend-php',
            'timestamp' => date(DATE_ATOM)
        ]
    );
});

$router->add('POST', '/auth/login', [$authController, 'login']);

$router->add('GET', '/api/v1/medicos', [$medicoController, 'list']);
$router->add('GET', '/api/v1/medicos/{id}', [$medicoController, 'getById']);
$router->add('POST', '/api/v1/medicos', $authMiddleware->requireRole(['admin'], [$medicoController, 'create']));
$router->add('PUT', '/api/v1/medicos/{id}', $authMiddleware->requireRole(['admin'], [$medicoController, 'update']));
$router->add('DELETE', '/api/v1/medicos/{id}', $authMiddleware->requireRole(['admin'], [$medicoController, 'delete']));

$router->dispatch(
    $_SERVER['REQUEST_METHOD'] ?? 'GET',
    $_SERVER['REQUEST_URI'] ?? '/'
);
