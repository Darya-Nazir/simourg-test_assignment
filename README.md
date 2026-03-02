# simourg

Проект этапа 4: Vue 3 + TypeScript + Pinia + Vue Router + axios + mock backend.

## Что реализовано на этапе 4

- Изолированный client-layer:
  - `src/client/axios` (axios instance + interceptors),
  - `src/client/clients/base.client.ts` (единый transport),
  - `src/client/clients/user.client.ts` (`list/getById/create/update`),
  - `src/client/config/endpoints.ts` (централизованные endpoints).
- Единый формат ошибок `ApiResult<T>` + `AppError` (`src/types/api.ts`).
- UI не вызывает axios напрямую (`HealthCheckPage` использует `healthClient`).
- Реализован users store со сценарием списка и серверной пагинацией/поиском.
- Добавлена синхронизация `page/limit/search` с URL query на `/users`.
- Unit-тесты client-layer, routes и users store.

## Маршруты этапа 2

- `/users` - страница списка пользователей (каркас).
- `/users/new` - страница создания пользователя (каркас).
- `/users/:id/edit` - страница редактирования пользователя (каркас).

## Установка

```sh
npm install
```

## Запуск разработки

Нужно запускать и фронт, и mock-бэкенд.

### Вариант 1: двумя терминалами

Терминал 1 (mock backend):

```sh
npm run mock
```

Терминал 2 (frontend):

```sh
npm run dev
```

### Вариант 2: одной командой

```sh
npm run dev:all
```

## Проверка mock backend

```sh
curl http://localhost:3001/health
```

Ожидаемый ответ:

```json
{ "status": "ok" }
```

Проверка пагинации и поиска:

```sh
curl "http://localhost:3001/users?page=1&limit=5"
curl "http://localhost:3001/users?page=2&limit=5"
curl "http://localhost:3001/users?page=1&limit=5&search=grace"
```

## Проверки качества

```sh
npm run typecheck
npm run test
```
