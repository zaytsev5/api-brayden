# User Service

## Configuration

Copy env example
```bash
$ cp .env.example .env
```

## Installation

1. Run packages
```bash
npm install or yarn install
```

2. Migrations database
config database connnection info in ormconfig.ts
```bash
- npm run migrate:create <migration-name>
- Update up/down method located src/migrations
- npm run migrate:up
```

3. Run Application
```bash
npm run dev or yarn dev
```

4. Run Application with docker
```bash
docker build -t rental-user-service .
docker run -p 3015:3015 --name rental-user-service rental-user-service
```

5. API Document
```bash
baseURL + /api/v1/docs
Example: http://localhost:3015/api/v1/docs
```

6. Documents
- Query builders: https://knexjs.org
- typeORM: https://typeorm.io
- Redis: https://github.com/luin/ioredis#readme
- Session: https://github.com/expressjs/session#readme
- Routes & swagger: https://tsoa-community.github.io/docs