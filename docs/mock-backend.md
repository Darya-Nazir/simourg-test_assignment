# Mock Backend

## Purpose

`mock/server.mjs` is used as a reproducible backend for all required scenarios:

- health-check;
- users list with server-side pagination and search;
- get user by id;
- create and update user;
- technical scenarios for UX checks.

## Core Endpoints

- `GET /health`
- `GET /users?page=<n>&limit=<n>&search=<query>`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`

## Technical Scenarios (`mock` query)

Supported only for `GET /users` and `GET /users/:id`:

- `mock=empty` - empty list.
- `mock=slow` - delayed response.
- `mock=error` - `500`.
- `mock=network` - forced socket close (network error simulation).

Examples:

```sh
curl "http://127.0.0.1:3001/users?page=1&limit=5&mock=empty"
curl "http://127.0.0.1:3001/users?page=1&limit=5&mock=slow"
curl -i "http://127.0.0.1:3001/users?page=1&limit=5&mock=error"
curl -i --max-time 3 "http://127.0.0.1:3001/users?page=1&limit=5&mock=network"
```

## Business Validation

For `POST /users` and `PATCH /users/:id`:

- `name` is required;
- `email` is required and validated by regex;
- `status` is required and must be `active` or `inactive`;
- `email` must be unique (otherwise `409`).

## Data

- Data source: `mock/db.json`.
- Data is normalized and includes at least 18 users for server-side pagination checks.

------------------------------------------------------------

## Назначение

`mock/server.mjs` используется как воспроизводимый backend для всех сценариев ТЗ:

- health-check;
- список пользователей с серверной пагинацией и поиском;
- получение пользователя по id;
- создание и обновление пользователя;
- технические сценарии для UX-проверок.

## Базовые endpoints

- `GET /health`
- `GET /users?page=<n>&limit=<n>&search=<query>`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`

## Технические сценарии (`mock` query)

Поддерживаются только для `GET /users` и `GET /users/:id`:

- `mock=empty` - пустой список.
- `mock=slow` - задержка ответа.
- `mock=error` - `500`.
- `mock=network` - принудительное закрытие сокета (эмуляция сетевой ошибки).

Примеры:

```sh
curl "http://127.0.0.1:3001/users?page=1&limit=5&mock=empty"
curl "http://127.0.0.1:3001/users?page=1&limit=5&mock=slow"
curl -i "http://127.0.0.1:3001/users?page=1&limit=5&mock=error"
curl -i --max-time 3 "http://127.0.0.1:3001/users?page=1&limit=5&mock=network"
```

## Бизнес-валидация

Для `POST /users` и `PATCH /users/:id`:

- `name` обязателен;
- `email` обязателен и проверяется regex;
- `status` обязателен и должен быть `active` или `inactive`;
- `email` должен быть уникальным (иначе `409`).

## Данные

- Источник данных: `mock/db.json`.
- Данные нормализованы и включают минимум 18 пользователей для проверки серверной пагинации.
