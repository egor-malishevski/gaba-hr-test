# Каталог пользователей (React + TypeScript)

Тестовое задание: страница-каталог пользователей с использованием публичного API [DummyJSON Users](https://dummyjson.com/docs/users).

## Что реализовано

- Список пользователей (`GET /users?limit=10&skip=0`)
- Поиск по имени (`GET /users/search?q=...`)
- Пагинация (10 пользователей на страницу, управление через `limit/skip/total`)
- Состояния `loading`, `error`, пустой результат
- Состояние страницы в URL (`?q=...&page=...`) для удобного шаринга и перезагрузки
- Skeleton при первой загрузке + мягкий overlay-loader при смене страницы
- Кнопка повторного запроса при ошибке
- Аккуратный адаптивный интерфейс для desktop/mobile

## Стек

- React
- TypeScript
- Vite

## Запуск

```bash
npm install
npm run dev
```

После запуска приложение доступно на `http://localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

## Проверка качества

```bash
npm run lint
npm run test
npm run format
```

## Структура

- `src/app` — точка входа и композиция страницы (`main.tsx`, `App.tsx`, стили)
- `src/features/users/api/fetchUsers.ts` — запросы к API
- `src/features/users/hooks/useUsersCatalog.ts` — бизнес-логика каталога
- `src/features/users/components` — UI-компоненты (`SearchForm`, `UsersGrid`, `UsersGridSkeleton`, `UserCard`, `PaginationControls`)
- `src/features/users/model` — типы и константы фичи
