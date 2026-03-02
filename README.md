# simourg

Проект этапа 2: Vue 3 + TypeScript + Pinia + Vue Router + axios + mock backend (json-server).

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
