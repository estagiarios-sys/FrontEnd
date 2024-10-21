FROM node:18


WORKDIR /app


COPY package*.json ./

RUN npm install

COPY . .

ENV GENERATE_SOURCEMAP=false

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["server", "-s"]
