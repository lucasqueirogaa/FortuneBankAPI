FROM node:20.9.0

WORKDIR /src/index.ts

COPY ./package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD npm run dev
