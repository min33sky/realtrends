## 1. Run PostgreSQL Server with docker compose

```bash
docker-compose up -d
```

## 2. Run Bash

```bash
// 'docker ps'로 container ID 확인
docker exec -it [container_id] bash
```

## 3. login as postgres

```bash
su - postgres
```

```bash
psql
```

## 4. Run following statements

```sql
CREATE DATABASE realtrends ENCODING 'UTF8';
CREATE USER realtrends WITH ENCRYPTED PASSWORD 'realtrends';
GRANT ALL PRIVILEGES ON DATABASE realtrends TO realtrends;
ALTER USER realtrends CREATEDB;
```

- **ALTER USER realtrends CREATEDB;**는 Prisma에서 Postrgres를 사용할 때 요구된다. shadow database를 관련인듯?
