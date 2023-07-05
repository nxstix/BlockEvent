From node:16-alpine

WORKDIR /nextapp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "coverage"]