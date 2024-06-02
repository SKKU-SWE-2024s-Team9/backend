# CLab:U Backend

## 실행방법
- `.env` 파일을 생성합니다.
```env
# dev 환경 전용 DB_URL입니다
DATABASE_URL=postgres://useruser:password@127.0.0.1:5433/dbdb
```
- 다음 명령어를 통해 test-db를 생성합니다.
```bash
docker compose -f docker-compose-dev.yaml up -d
```
- 서버 실행 명령어는 다음과 같습니다. 
```bash
# 로컬 DB 생성 (dev.db가 없는 경우)
npx prisma migrate dev --name "initial"

# 시드 생성 (dev.db에 데이터가 없는 경우)
npx prisma db seed

# 서버 실행
npm run dev
```

기본적으로 `localhost:3000`에 호스팅됩니다.

## 기본 테스트 계정

- 시스템 관리자

  "username": "clabu"
  "password": "clabUA1!@"

- 랩 대표자

  "username": "swecha"
  "password": "skkuA1!@"
  
- 동아리 대표자

  "username": "mav"
  "password": "mavmavA1!@"

