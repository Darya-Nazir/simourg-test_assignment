# simourg

Проект этапа 3: Vue 3 + TypeScript + Pinia + Vue Router + axios + mock backend (json-server).

## Что реализовано на этапе 3

- Изолированный client-layer:
  - `src/client/axios` (axios instance + interceptors),
  - `src/client/clients/base.client.ts` (единый transport),
  - `src/client/clients/user.client.ts` (`list/getById/create/update`),
  - `src/client/config/endpoints.ts` (централизованные endpoints).
- Единый формат ошибок `ApiResult<T>` + `AppError` (`src/types/api.ts`).
- UI больше не вызывает axios напрямую (`HealthCheckPage` переведен на `healthClient`).
- Unit-тесты client-layer на success/error и HTTP-методы.

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

## Проверки качества

```sh
npm run typecheck
npm run test
```
