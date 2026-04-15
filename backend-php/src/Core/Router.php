<?php

declare(strict_types=1);

namespace App\Core;

class Router
{
    /**
     * @var array<int, array{method:string, pattern:string, regex:string, handler:callable}>
     */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $normalizedPattern = '/' . trim($pattern, '/');

        if ($normalizedPattern === '//') {
            $normalizedPattern = '/';
        }

        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $normalizedPattern,
            'regex' => $this->toRegex($normalizedPattern),
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $normalizedMethod = strtoupper($method);
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $normalizedPath = '/' . trim($path, '/');

        if ($normalizedPath === '//') {
            $normalizedPath = '/';
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $normalizedMethod) {
                continue;
            }

            if (!preg_match($route['regex'], $normalizedPath, $matches)) {
                continue;
            }

            $params = [];

            foreach ($matches as $key => $value) {
                if (is_string($key)) {
                    $params[$key] = $value;
                }
            }

            call_user_func($route['handler'], $params);
            return;
        }

        throw new ApiException(404, 'Rota nao encontrada.', [sprintf('%s %s', $normalizedMethod, $normalizedPath)]);
    }

    private function toRegex(string $pattern): string
    {
        $regex = preg_replace('/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/', '(?P<$1>[^/]+)', $pattern);
        return '#^' . $regex . '/?$#';
    }
}
