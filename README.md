# simourg

Проект этапа 6: Vue 3 + TypeScript + Pinia + Vue Router + axios + mock backend.

## Что реализовано на этапе 6

- UI-состояния списка пользователей: `loading`, `error`, `empty`, `success`.
- UI-состояния формы пользователя: `loading user`, `load error`, `submit error`, `submitting`.
- Переиспользуемые базовые компоненты:
  - `src/components/Common/AppButton.vue`
  - `src/components/Common/AppInput.vue`
  - `src/components/Common/AppSelect.vue`
  - `src/components/Common/AppLoader.vue`
  - `src/components/Common/AppEmptyState.vue`
- Страница `/users` использует `Common`-компоненты и поддерживает выбор mock-сценария.
- Mock backend поддерживает технические сценарии для `/users` и `/users/:id` через query `mock`:
  - `empty`
  - `slow`
  - `error`
  - `network`
- SCSS придерживается BEM-структуры по страницам и компонентам.

## Маршруты

- `/users` - список пользователей.
- `/users/new` - создание пользователя.
- `/users/:id/edit` - редактирование пользователя.

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

### Проверка пагинации и поиска

```sh
curl "http://localhost:3001/users?page=1&limit=5"
curl "http://localhost:3001/users?page=2&limit=5"
curl "http://localhost:3001/users?page=1&limit=5&search=grace"
```

### Проверка create/edit

```sh
curl -X POST "http://localhost:3001/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new.user@example.com","status":"active"}'

curl -X PATCH "http://localhost:3001/users/1" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Updated","email":"ada.updated@example.com","status":"inactive"}'
```

### Проверка серверной валидации

```sh
curl -i -X POST "http://localhost:3001/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"wrong","status":"unknown"}'
```

### Проверка UI-сценариев (этап 6)

```sh
curl "http://localhost:3001/users?page=1&limit=5&mock=empty"
curl "http://localhost:3001/users?page=1&limit=5&mock=slow"
curl -i "http://localhost:3001/users?page=1&limit=5&mock=error"
curl -i "http://localhost:3001/users?page=1&limit=5&mock=network"
```

## Проверки качества

```sh
npm run typecheck
npm run test
```
