# Arquitetura do Sistema

## Visao Geral
A solucao e composta por 4 blocos:

1. Frontend SPA em React (Vite) para operacao de medicos e pacientes.
2. Backend PHP (MVC) para dominio de medicos.
3. Backend Node.js (MVC) para dominio de pacientes.
4. Banco MySQL unico e compartilhado.

## Diagrama Logico
- Frontend chama API PHP para rotas de medicos.
- Frontend chama API Node para rotas de pacientes.
- API PHP e API Node usam o mesmo schema MySQL.
- Cada backend tem validacao, camada de servico, modelo e tratamento global de erro.

## Correcao de Inconsistencias do Enunciado
1. Rota corrigida de pacientes:
   - Incorreta: POST /api/v1/medicos (Node)
   - Correta: POST /api/v1/pacientes
2. Campo duplicado em pacientes:
   - Modelagem final usa ambos os campos: carteirinha e cpf, com regras especificas e constraints unicas.

## Arquitetura por Servico

### Frontend (React + Vite)
- Estrutura por dominio:
  - pages para telas
  - components para UI reutilizavel
  - services para chamadas HTTP
  - i18n para internacionalizacao (pt-BR default)
- Estados tratados:
  - loading
  - erro
  - vazio
  - feedback de sucesso/erro

### Backend Node (Pacientes)
- MVC + Service:
  - routes -> controllers -> services -> models
- mysql2/promise com pool
- Validacao de payload e CPF
- Login JWT em /auth/login
- Operacoes de escrita protegidas por authenticate + requireRole(admin)
- Middleware de erro padronizado
- Resposta JSON em contrato unico

### Backend PHP (Medicos)
- MVC estruturado:
  - Router -> Controller -> Service -> Model
- PDO com prepared statements
- Login JWT em /auth/login
- Operacoes de escrita protegidas por AuthMiddleware::requireRole(admin)
- Tratamento global de excecoes
- Resposta JSON em contrato unico

## Autenticacao e Autorizacao
- GETs de listagem/consulta permanecem publicos.
- POST/PUT/DELETE exigem token Bearer JWT com role admin.
- Frontend obtem token automaticamente antes de operacoes de escrita.

## Contrato de Resposta

### Sucesso
{
  "success": true,
  "message": "...",
  "data": ...
}

### Erro
{
  "success": false,
  "message": "...",
  "errors": [...]
}

## Regras de Validacao

### Medicos
- nome: obrigatorio
- crm: obrigatorio
- uf_crm: obrigatorio com 2 caracteres

### Pacientes
- nome: obrigatorio
- dataNascimento: obrigatorio
- carteirinha: obrigatoria
- cpf: obrigatorio (11 digitos numericos)

## Fluxo de Requisicao
1. Usuario interage com formulario no frontend.
2. Frontend envia requisicao HTTP para API de dominio.
3. Router delega ao controller.
4. Controller valida entrada e chama service.
5. Service aplica regra de negocio.
6. Model executa query no MySQL com prepared statements.
7. Controller retorna JSON padronizado.
8. Frontend atualiza estado e feedback visual.

## Principios Aplicados
- Separacao de responsabilidades
- Baixo acoplamento entre frontend e backends
- Contrato de API consistente
- Seguranca basica obrigatoria
- Estrutura pronta para evolucao futura
