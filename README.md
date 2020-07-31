# PERN Docker Boilerplate
a PERN(Postgres, Express, React, Node) Boilerplate for developing and go-prod with Docker

## Target of the project
This project aims to consolidate some key concepts of 
* 🖥️ Backend Development - _Node_
* 🖼️ Frontend Development - _React_
* 🔄 CD/CI - _GitHub Actions_
* ⚒️ DevOps - _Docker, Nginx, PM2_
* 🐘 DB Administration & Usage - _PostgresSQL (optional:mySQL)_

By creating a PERN boilerplate that will be used to start projects.

## Roadmap

| State | Month              | Target                                       |
|-------|--------------------|----------------------------------------------|
| ⌛     | June 2020         | Start Project, Start Docker                  |
| ⏳     | July 2020         | Backend Development, Database Creation       |
| 🔮    | August 2020        | Backend Development                         |
| 🔮    | September 2020     | Frontend Development                        |
| 🔮    | October 2020        | Pipelines And Automation                   |

## Milestones
### 🖥️ Backend
* ✔️ Clustering 
* ✔️ Custom Logger
* ✔️ Authentication with passport-local
* ✔️ Add validators
* ✔️ Create Server API (TODO: Protect Them)
* ✔️ Create Debug API (TODO: Protect Them)
* ✔️ Connect to postgres database depending on NODE_ENV
* 📝 Authentication with facebook and google
* 📝 Create private/public routes for authenticated users
* 📝 Create private routes for Admin/base users
* 📝 Create emails
* 📝 Create upload files
* 📝 Create Subscriptions API
* 📝 Create General Settings API
* 📝 Create Profile API
* 📝 Create file upload API
* 📝 Create TOS API
* 📝 Add notifications
* 📝 Log rotation

### 🖼️ App Development
* ✔️ Added caching strategy (TODO: Add google fonts caching)
* ✔️ Add MUI Drawer
* 📝 Connect to API depending on REACT_APP_NODE_ENV
* 📝 Add Axios Fetcher
* 📝 Add ThemeContext
* 📝 Add notifications
* 📝 Add UserContext
* 📝 Add Public/Private Routes

### 🏗️ Admin Development
🚧 To Be Defined

### 🔄 CD/CI
* 📝 Create a pipeline that creates a docker image with the  backend and publish it to dockerhub
* 📝 Create a pipeline that creates a docker image with the  frontend and publish it to dockerhub
* 📝 Create a pipeline that pulls app image from the server
* 📝 Create a pipeline that pulls backend image from the server

### ⚒️ DevOps
* 📝 Create Dockerfile for backend development 
* 📝 Create Dockerfile for frontend development
* 📝 Create docker-compose.yml for development 
* 📝 Add a postgres container in docker-compose.yml
* 📝 Add nginx
* 📝 Add certificates
* 📝 Add custom domains
* 📝 Add pm2 to backend in order to set the go-prod
* 📝 Add pm2 to frontend in order to set the go-prod

### 🐘 DB Administration & Usage

* 📝 Setup a user for backend app with permission restrictions
