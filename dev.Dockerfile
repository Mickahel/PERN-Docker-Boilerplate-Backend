# pull official base image
FROM node:13.12.0-alpine

#docker exec -ti <container-Name> sh
# Create app directory
WORKDIR /app/backend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm 
RUN pnpm install --silent
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./

CMD [ "pnpm", "run", "dev"]   