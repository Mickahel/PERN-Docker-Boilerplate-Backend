# PERN Docker Boilerplate Backend

![PERN Header](https://github.com/Mickahel/Mickahel/blob/master/media/PERN%20Header.png)

a PERN (Postgres, Express, React, Node) Boilerplate for developing and go-prod with Docker

**Do you want to see the documentation in a fancy way?** [Check Out Nicedoc](https://nicedoc.io/mickahel/PERN-Docker-Boilerplate-Backend#user-content-%EF%B8%8F-admin-development)

## Technologies

- 🖥️ Node
- 🖼️ React
- 🐋 Docker
- 📊 PM2
- 🐘 PostgreSQL / mySQL

## Platforms

| Platform                                                                                      | Hosted On                                                                                                                                                      | Github Actions                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 🖥️ [Backend](https://github.com/Mickahel/PERN-Docker-Boilerplate-Backend)                     | [![Heroku App Status](http://heroku-shields.herokuapp.com/pern-boilerplate-backend)](https://pern-boilerplate-backend.herokuapp.com)                           | ![workflow badge](https://github.com/mickahel/PERN-Docker-Boilerplate-Backend/actions/workflows/docker-image.yml/badge.svg) |
| 🖼️ [Webapp/App/PWA - Client Side](https://github.com/Mickahel/PERN-Docker-Boilerplate-WebApp) | [![Netlify Status](https://api.netlify.com/api/v1/badges/e70b59bf-7f05-4be3-acbf-674e0d753c51/deploy-status)](https://app.netlify.com/sites/apppern/deploys)   | ![workflow badge](https://github.com/mickahel/PERN-Docker-Boilerplate-WebApp/actions/workflows/docker-image.yml/badge.svg)  |
| 🎛️ [Admin - Admin Side](https://github.com/Mickahel/PERN-Docker-Boilerplate-Admin)            | [![Netlify Status](https://api.netlify.com/api/v1/badges/9ac4787c-d562-442e-a66d-0bdd8395991b/deploy-status)](https://app.netlify.com/sites/adminpern/deploys) | ![workflow badge](https://github.com/mickahel/PERN-Docker-Boilerplate-Admin/actions/workflows/docker-image.yml/badge.svg)   |

## Features

- 🖼️ Basic Frontend Theme
- 🧑‍🤝‍🧑 User Management System
- 🤴 User Roles & Permissions
- 📱 Multiplatform
- ➡️ Authentication through Refresh Token & Cookies
- 📘 Email Login & Social Login (Google and Facebook)
- 💥 Logs System and Logs Rotation
- 💬 Push Notifications
- ⚖️ GDPR Compliant
- 🐛 Feedback and Ticket management

# Get Started

The Get Started is quite long, but it's easy.

## 1. Clone Repository and Install

The first thing to do is to clone the repository and install the packages
💡 _Be sure to have [Git](https://git-scm.com/) and [Node](https://nodejs.org/en/) installed_

```
git clone https://github.com/Mickahel/PERN-Docker-Boilerplate-Backend.git
cd PERN-Docker-Boilerplate-Backend
npm install
```

## 2. Setup the Database

The database could be created natively on your machine, or through a cloud platform such as [Elephant SQL](https://www.elephantsql.com/) or locally through Docker.

Specifically, if it has been chosen the third way, there is a `docker.compose.db.html` in `dockerServices/db`.
If you want to run the Database through this way, type the following commands from the root folder:

```
cd dockerServices/db
docker-compose -f docker-compose.db.yml up
```

## 3. Setup Environement Variables for Production and Development

In order to develop and deploy the Repository, it is needed to create `ENV` files with `ENV Variables`.
To do so, create **in the root folder** (the folder in which there is the `index.ts` file ) 2 files: `.env.developent` and `.env.production`.

Write in the files the following environement variables.

```
#Server
CLUSTER=
PORT=
NODE_ENV=

#Secrets
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

#Access Token
ACCESS_TOKEN_EXPIRATION=

#Logs
LOG_FILE=
LOG_LEVEL=
LOG_DIRECTORY=

#Urls
ADMIN_FRONTEND_URL=
FRONTEND_URL=
BACKEND_URL=

#Database
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=

#Mail
MAILER_USER=
MAILER_PASSWORD=

#Firebase
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_DATABASE_URL=

#FACEBOOK LOGIN
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

#GOOGLE LOGIN
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

In the following part, it will be explained how to compile each variable.

### Server environement variables

`CLUSTER=` needs to be set `false` if you don't want to use the [cluster](https://nodejs.org/api/cluster.html) mode. `true`, if you want to use it.

`PORT=` refers to the port on which the express server will listen. If not set, the default port will be set to `8000`

`NODE_ENV=` should be set `production` in `.env.production`, while should be set `development` in `.env.development`

### Secrets environement variables

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

## 4. Change Configuration Data

## 5. Setup CORS

## 6. Setup certificates for Development

# Deploy

# Development

# Roadmap

| State | Month          | Target                                           |
| ----- | -------------- | ------------------------------------------------ |
| ⌛    | June 2020      | Start Project, Start Docker                      |
| ⌛    | July 2020      | Backend Development, Database Creation           |
| ⌛    | August 2020    | Backend Development                              |
| ⌛    | September 2020 | Frontend Development                             |
| ⌛    | October 2020   | No Development                                   |
| ⏳    | November 2020  | Backend & Frontend Development                   |
| ⏳    | December 2020  | Backend & Frontend Development                   |
| ⏳    | January 2021   | Frontend Development & goProd on Cloud Platforms |
| 🔮    | February 2021  | Trypescript Migration and DevOps                 |
| 🔮    | March 2021     | Documentation & Bugfixing                        |

### 🖥️ Backend

[Trello Link](https://trello.com/b/Gz5LxEAc)

### 🖼️ App Development

[Trello Link](https://trello.com/b/s72xKjP4)

### 🏗️ Admin Development

[Trello Link](https://trello.com/b/ejA8jwGB)

### ⚒️ DevOps

[Trello Link](https://trello.com/b/3odi5sKz)

### 🖼️ Documentation

[Trello Link](https://trello.com/b/8MJ7mlDE)
