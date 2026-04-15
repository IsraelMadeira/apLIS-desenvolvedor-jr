<?php

declare(strict_types=1);

$requestedPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$publicTarget = __DIR__ . '/public' . $requestedPath;

if ($requestedPath !== '/' && is_file($publicTarget)) {
    return false;
}

require __DIR__ . '/public/index.php';
