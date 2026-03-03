# simourg

Test task `users`: Vue 3 + TypeScript + Pinia + Vue Router + axios + mock backend.

## Implemented

- Domain-driven architecture for `users` with split layers: `pages/components/composables/stores/client/types`.
- Users list with server-side `page/limit/search` and URL query synchronization.
- Unified create/edit form with validation and error handling.
- Single API client layer (`base client` + `user client`) with no direct `axios` calls from UI.
- UI states `loading/error/empty/success` for list and form.
- BEM-based SCSS and reusable common components.
- Mock backend with business and technical acceptance scenarios.
- Unit tests for key logic: `client`, `store`, `validation`, `form`, `routes`.

## Routes

- `/users` - users list.
- `/users/new` - user creation.
- `/users/:id/edit` - user editing.

## Requirements

- Node.js: `^20.19.0 || >=22.12.0`.
- npm: any version compatible with Node.

## Installation

```sh
npm install
```

## Run

Two terminals:

```sh
npm run mock
npm run dev
```

Single command:

```sh
npm run dev:all
```

## Quality Commands

```sh
npm run typecheck
npm run test
npm run build
```

## Quick API Check

```sh
curl "http://127.0.0.1:3001/health"
curl "http://127.0.0.1:3001/users?page=1&limit=5"
curl "http://127.0.0.1:3001/users?page=1&limit=5&search=grace"
```

More details about mock scenarios:

- [docs/mock-backend.md](docs/mock-backend.md)

------------------------------------------------------------

Тестовое задание `users`: Vue 3 + TypeScript + Pinia + Vue Router + axios + mock backend.

## Что реализовано

- Архитектура по доменному срезу (`users`) с разделением `pages/components/composables/stores/client/types`.
- Список пользователей с серверными `page/limit/search` и синхронизацией query-параметров URL.
- Универсальная форма create/edit с валидацией и обработкой ошибок.
- Единый клиентский слой API (`base client` + `user client`) без прямых вызовов `axios` из UI.
- UI-состояния `loading/error/empty/success` для списка и формы.
- BEM-структура SCSS и переиспользуемые общие компоненты.
- Mock backend с бизнес и техническими сценариями для приемки.
- Unit-тесты ключевой логики: `client`, `store`, `validation`, `form`, `routes`.

## Маршруты

- `/users` - список пользователей.
- `/users/new` - создание пользователя.
- `/users/:id/edit` - редактирование пользователя.

## Требования

- Node.js: `^20.19.0 || >=22.12.0`.
- npm: любой совместимый с Node.

## Установка

```sh
npm install
```

## Запуск

Вариант с двумя терминалами:

```sh
npm run mock
npm run dev
```

Вариант одной командой:

```sh
npm run dev:all
```

## Команды качества

```sh
npm run typecheck
npm run test
npm run build
```

## Быстрая проверка API

```sh
curl "http://127.0.0.1:3001/health"
curl "http://127.0.0.1:3001/users?page=1&limit=5"
curl "http://127.0.0.1:3001/users?page=1&limit=5&search=grace"
```

Дополнительно по mock-сценариям:

- [docs/mock-backend.md](docs/mock-backend.md)
