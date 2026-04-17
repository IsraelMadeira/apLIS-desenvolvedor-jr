# Teste Tecnico Fullstack - Clinica Integrada

Entrega final do teste pratico para vaga de Desenvolvedor Junior.

## 1) Objetivo do teste

Construir uma aplicacao fullstack simples com:

- Frontend React (SPA)
- Backend PHP para medicos
- Backend Node.js para pacientes
- Banco MySQL compartilhado

Requisitos minimos do enunciado:

- PHP: GET e POST de medicos
- Node: GET e POST de pacientes
- Frontend com sidebar (Medicos e Pacientes), listagem e cadastro dos dois dominios

Desafios extras sugeridos:

- CRUD completo
- Preparacao para multi linguagem

## 2) Escopo entregue

### Requisitos obrigatorios

- Frontend React SPA integrado com as duas APIs
- Backend PHP em arquitetura MVC
- Backend Node em arquitetura MVC
- MySQL compartilhado para os dois backends
- Listagem e cadastro para medicos e pacientes

### Diferenciais mantidos

- CRUD completo para medicos e pacientes
- JWT nos dois backends
- Contrato JSON padronizado
- Tratamento global de erros
- i18n preparado no frontend com pt-BR como padrao

## 3) Arquitetura

Fluxo geral:

1. Frontend chama a API de dominio (PHP para medicos, Node para pacientes)
2. Rotas delegam para controllers
3. Controllers chamam services
4. Services aplicam validacoes e regras
5. Models executam queries no MySQL com prepared statements
6. API responde JSON padronizado

## 4) Estrutura do projeto

- frontend: SPA React
- backend-node: API de pacientes
- backend-php: API de medicos
- database: schema SQL compartilhado
- docs: documentacao de arquitetura

## 5) Banco de dados compartilhado

Arquivo: database/schema.sql

Tabelas:

- medicos
- pacientes

Constraints principais:

- medicos: UNIQUE (crm, uf_crm)
- pacientes: UNIQUE (carteirinha), UNIQUE (cpf)
- checks de formato para uf_crm e cpf

## 6) Contrato JSON padrao

Sucesso:

{
  "success": true,
  "message": "...",
  "data": {}
}

Erro:

{
  "success": false,
  "message": "...",
  "errors": []
}

## 7) APIs e autenticacao

### Backend PHP (Medicos)

Base URL: http://localhost:8001

- GET /health (publico)
- POST /auth/login (publico)
- GET /api/v1/medicos (publico)
- GET /api/v1/medicos/{id} (publico)
- POST /api/v1/medicos (protegido, role admin)
- PUT /api/v1/medicos/{id} (protegido, role admin)
- DELETE /api/v1/medicos/{id} (protegido, role admin)

### Backend Node (Pacientes)

Base URL: http://localhost:3001

- GET /health (publico)
- POST /auth/login (publico)
- GET /api/v1/pacientes (publico)
- GET /api/v1/pacientes/{id} (publico)
- POST /api/v1/pacientes (protegido, role admin)
- PUT /api/v1/pacientes/{id} (protegido, role admin)
- DELETE /api/v1/pacientes/{id} (protegido, role admin)

### Observacao sobre o enunciado

Foi mantida a correcao da inconsistencia original:

- Node correto: POST /api/v1/pacientes

## 8) Variaveis de ambiente

Copiar os exemplos para .env:

- .env.example (raiz, referencia compartilhada)
- backend-node/.env.example
- backend-php/.env.example
- frontend/.env.example

Variaveis importantes:

- JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE
- AUTH_USERNAME, AUTH_PASSWORD, AUTH_ROLE
- VITE_API_AUTH_USERNAME, VITE_API_AUTH_PASSWORD

Importante:

- Operacoes de escrita usam JWT
- Frontend faz login automatico para obter token antes de POST/PUT/DELETE

## 9) Setup e execucao local

Pre-requisitos:

- Node.js 18+
- npm 9+
- MySQL 8+
- PHP 8.1+
- Composer 2+

### 9.1 Criar banco

Executar:

- database/schema.sql

### 9.2 Backend Node

1. cd backend-node
2. npm install
3. npm run dev

### 9.3 Backend PHP

1. cd backend-php
2. composer install
3. php -S localhost:8001 router.php

### 9.4 Frontend

1. cd frontend
2. npm install
3. npm run dev

Frontend:

- http://localhost:5173

## 10) Validacao manual sugerida

1. Health checks:

- GET http://localhost:3001/health
- GET http://localhost:8001/health

2. Listagens publicas:

- GET /api/v1/medicos
- GET /api/v1/pacientes

3. Login para obter token:

- POST /auth/login com body {"username":"admin","password":"admin123"}

4. CRUD com token:

- Usar Authorization: Bearer <token> em POST/PUT/DELETE

5. Frontend:

- Abrir pagina Medicos e Pacientes
- Validar listagem, cadastro, edicao e exclusao
- Validar estados de loading, erro e vazio

## 11) Multi linguagem

Estrutura i18n pronta em:

- frontend/src/i18n/I18nProvider.jsx
- frontend/src/i18n/useI18n.js
- frontend/src/i18n/messages/pt-BR.js

Idioma padrao atual: pt-BR.

## 12) Seguranca e boas praticas

- Prepared statements (PDO e mysql2)
- Validacoes no service layer
- Middleware de erro global
- JWT com issuer/audience
- Guardas de seguranca para evitar segredos e credenciais padrao em producao

## 13) Checklist final do enunciado

- Frontend React SPA: atendido
- Backend PHP para medicos: atendido
- Backend Node para pacientes: atendido
- Banco MySQL compartilhado: atendido
- GET/POST minimos (medicos/pacientes): atendido
- Sidebar com Medicos/Pacientes: atendido
- Telas de listagem e cadastro: atendido
- Integracao ponta a ponta: atendido
- Tratamento de erros: atendido
- Documentacao: atendido
- CRUD completo (extra): atendido
- Multi linguagem preparado (extra): atendido
