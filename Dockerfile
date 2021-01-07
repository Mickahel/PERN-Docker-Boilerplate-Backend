FROM node

WORKDIR /webapp/backend

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . ./
EXPOSE 4000

CMD ["npm", "run","deployOnDocker"]
