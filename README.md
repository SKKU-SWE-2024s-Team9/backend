# CLab:U Backend

## 실행방법

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