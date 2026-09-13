# Mirante — Mock Server (backend)

API mockada com [@mocks-server/main](https://www.mocks-server.org) para o MVP Mirante.

## Stack

- **@mocks-server/main** v3 (3.12.x — última estável; o projeto foi
  descontinuado, sem novas releases)

## Requisitos

- Node.js 18+

## Instalação

```bash
npm install
```

## Execução

```bash
npm run mocks
```

Sobe em **http://localhost:3100**.

## Delay de resposta (env)

O tempo de resposta de **todas** as requisições é configurável via
`MOCK_DELAY_SECONDS` (em **segundos**), lido no env pelo `mocks.config.js`:

```bash
MOCK_DELAY_SECONDS=2 npm run mocks   # responde após 2s
```

- Default sem env: `0` (sem delay).
- `.env.example` traz o valor de referência (`2`).

## Usuário de teste

| nome | email | senha |
|---|---|---|
| Administrador | admin@mirante.com.br | 123456 |

## Rotas

| Rota | Método | Variantes |
|---|---|---|
| `/api/auth/login` | POST | `login-sucesso` (middleware valida credenciais), `email-nao-encontrado` (401), `senha-incorreta` (401), `erro-servidor` (500) |
| `/api/auth/reset-password` | POST | `sucesso` (sempre 200 OK — fake) |
| `/api/auth/me` | GET | `sucesso` (valida o token Bearer) |

### Login (exemplo)

```bash
curl -X POST http://localhost:3100/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mirante.com.br","senha":"123456"}'
```

Resposta 200:

```json
{
  "token": "<jwt-like fake>",
  "user": { "id": "u-001", "nome": "Administrador", "email": "admin@mirante.com.br" }
}
```

Erros: 401 `{"message":"Email não encontrado"}` / `{"message":"Senha incorreta"}`.

### Reset de senha (fake — sempre OK)

```bash
curl -X POST http://localhost:3100/api/auth/reset-password \
  -H "Content-Type: application/json" -d '{}'
```

### Coleções (cenários alternativos)

A coleção ativa é definida em `mocks.config.js` (`mock.collections.selected`):

- `base` (padrão) — login valida credenciais de verdade
- `login-email-nao-encontrado` / `login-senha-incorreta` / `erro-servidor` —
  cenários fixos para testes

## Token

O token fake é um **JWT-like**: `base64url(header).base64url(payload).
base64url(assinatura)`. O payload contém `sub`, `nome`, `email`, `iat` e
`exp` (1 hora). **Não é segurança real** — é mock.

## Estrutura

```
backend/
├── mocks.config.js           # porta 3100 + delay via env
├── src/
│   └── usuarios.js           # entidade Usuario (fixture)
└── mocks/
    ├── routes/auth.js        # rotas de auth (login/reset/me)
    └── collections/          # base + cenários de teste
```
