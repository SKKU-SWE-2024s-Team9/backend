#!/bin/sh
npx prisma migrate dev --name init
npm prisma db seed
npm start 