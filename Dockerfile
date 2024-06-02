FROM node:20

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]