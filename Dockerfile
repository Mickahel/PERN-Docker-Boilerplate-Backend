FROM node

WORKDIR /webapp/backend

# Install app dependencies
COPY package*.json ./

#RUN npm install
#RUN npm ci --only=production
RUN npm install

COPY . ./
RUN npm run tsc
RUN npm run postbuild
EXPOSE 8000

CMD ["npm", "run","deployOnDocker"]
