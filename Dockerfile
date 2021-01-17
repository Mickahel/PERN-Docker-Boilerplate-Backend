FROM node

WORKDIR /webapp/backend

# Install app dependencies
COPY package*.json ./

#RUN npm install
RUN npm ci --only=production

COPY . ./
EXPOSE 4000

CMD ["npm", "run","deployOnDocker"]
