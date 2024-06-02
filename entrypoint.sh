#!/bin/sh
sleep 3
npx prisma migrate dev --name init
npx prisma db seed
npm start 