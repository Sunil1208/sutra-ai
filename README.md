# sutra-ai

**SutraAi** is an AI orchestration gateway that dynamically routes requests between multiple Large Language Models (LLMs) — like GPT-4o, Claude, and Gemini — based on latency, cost, and reasoning complexity. Built with Node.js, Fastify, Redis, BullMQ, and pgvector, it brings intelligence, observability, and scalability to multi-model AI systems.

> Designed for developers and enterprises who want a unified, scalable, and observable interface for multi-model AI systems.

---

## Key Features

| Category                     | Description                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| **TypeScript + Fastify**     | Fully typed modular architecture with strict compile-time safety.                         |
| **Environment Management**   | `.env` + `.env.test` with Zod-based validation via `@config/env`.                         |
| **Schema Validation Layer**  | Global `validationPlugin` powered by **Zod**, enforcing request & response validation.    |
| **Standardized Responses**   | Consistent success/error response format using `sendSuccess()` and `ApiError` classes.    |
| **Global Error Handler**     | Centralized `errorHandlerPlugin` (wrapped in `fastify-plugin`) for unified error control. |
| **Testing Framework**        | Mocha + Chai + Supertest + NYC for full unit & integration test coverage.                 |
| **Code Quality**             | ESLint v9 (flat config) + Prettier v3 with strict formatting rules.                       |
| **Structured Logging**       | Pino logger with pretty transport in dev and JSON output in production.                   |
| **Extensible Plugin System** | Modular Fastify plugins: logging, validation, error handling — easy to extend.            |
| **100% Passing Tests**       | All environment, route, and validation tests pass with clean lint & coverage.             |

---

## Project Structure

```
sutra-ai/
├── src/
│ ├── app.ts
│ ├── server.ts
│ ├── config
│ ├── controllers
│ ├── routes
│ ├── plugins
│ │ ├── logging.plugin.ts
│ │ ├── validation.plugin.ts
│ │ └── errorHandler.plugin.ts
│ ├── schemas
│ ├── utils/
│ │ ├── errors
│ │ └── response.util.ts
│ └── tests/
│ ├── utils/setup.ts
│ └── integration/
│
├── .env
├── .env.test
├── tsconfig.json
├── eslint.config.cjs
├── package.json
└── README.md
```

---

## Running the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Server runs at http://localhost:3000

### 3. Run tests

```bash
npm run test
```

### 4. Run lint

```bash
npm run lint
```

### 5. Run format

```bash
npm run format
```

### Integration Test Coverage

Includes full integration coverage for:

- `/health` route
- Global error handler
- Validation plugin behavior

---

### Core Design Principles

- **Type Safety First:** Zod + TypeScript for runtime & compile-time safety.
- **Encapsulated Modularity:** Each concern (config, plugins, routes) isolated for scalability.
- **Convention over Configuration:** Consistent naming and directory patterns.
- **Fail Fast:** Invalid environment or payloads crash early.
- **Observability Built-In:** Pino logging and standardized response metrics.

---

### Scripts Reference

| Script           | Description                           |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Start Fastify server with ts-node-dev |
| `npm run build`  | Compile TypeScript to `dist/`         |
| `npm start`      | Run compiled production build         |
| `npm run test`   | Run all test suites                   |
| `npm run lint`   | Run ESLint checks                     |
| `npm run format` | Auto-format code with Prettier        |
