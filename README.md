# English Learning App

## Test user

Для быстрого входа:

- Login: `danila@mail.ru`
- Password: `1234567890`

---

## Запуск проекта

### Запуск всех сервисов

```bash
docker compose up
```

### Запуск с пересборкой (если менялся server.js или package.json)

```bash
docker compose up --build
```

### Остановка проекта

```bash
docker compose down
```

### Перезапуск только backend (Node.js app)

Если менялся server.js:

```bash
docker restart english_learning_app
```

## Логи приложения

Просмотр логов в реальном времени

```bash
docker logs -f english_learning_app
```

## База данных

### Удаляет все данные

```bash
docker compose down
rm -rf ./postgres-data
docker compose up --build
```



---
Переделать правильно css и добавить классы в html
---