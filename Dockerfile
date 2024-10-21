FROM node:18


WORKDIR /


COPY . /

RUN npm install


RUN npm run build

RUN npm install -g serve


EXPOSE 3000


CMD ["server", "-s", "build", "-l", "3000"]
