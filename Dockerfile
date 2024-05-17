FROM node:20.9.0

ARG PORT

ENV PORT ${PORT}

WORKDIR /src

COPY ./package.json .
RUN npm install

COPY . .

EXPOSE ${PORT}

CMD npm run dev
