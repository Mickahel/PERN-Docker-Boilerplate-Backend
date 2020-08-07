![PERN Header](https://github.com/Mickahel/Mickahel/blob/master/media/PERN%20Header.png)
# PERN Docker Boilerplate
a PERN(Postgres, Express, React, Node) Boilerplate for developing and go-prod with Docker

## Technologies
* 🖥️ Node
* 🖼️ React
* 🔄 GitHub Actions
* 🐋 Docker
* 🤹 Nginx 
* 📊 PM2
* 🐘 PostgreSQL / mySQL

## Platforms
* 🖥️ Backend
* 🖼️ Webapp/App/PWA - Client Side
* 🎛️ Admin - Admin Side


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
* 📝 Authentication with facebook and google API (WIP, blocked by file upload)
    * 📝 Validator
    * 📝 Routes
    * 📝 Swagger Documentation
* 📝 Create emails
* 📝 Create file upload API - WIP
    * 📝 Validator
    * 📝 Swagger Documentation
    * 📝 Models 
    * 📝 Repository
* 📝 Add notifications

### 🖼️ App Development
* 📝 [Add google fonts caching](https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts)
* 📝 [Add UX dialog to SW](https://developers.google.com/web/tools/workbox/guides/advanced-recipes)
* 📝 [Add MUI Drawer](https://material-ui.com/components/drawers/#mini-variant-drawer)
* 📝 Connect to API depending on REACT_APP_NODE_ENV
* 📝 Add Axios Fetcher
* 📝 Add ThemeContext
* 📝 Add notifications
* 📝 Add UserContext
* 📝 Add Public/Private Routes
* 📝 Try React Query

### 🏗️ Admin Development
🚧 To Be Defined
* 👀 Views
    * 📝 Dashboard
    * 📝 TOS Editor
    * 📝 Users
        * 📝 Single User
    * 📝 Subscriptions
    * 📝 Logs

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

### 🖼️ Documentation
* 📝 Getting Started
* 📝 Deploy
* 📝 Change Configs
* 📝 Development
* 📝 [Backend] how to use logger
* 📝 [Frontend] how to use fetcher


### 🔮 Future development
* 📝 Subscriptions
    * 📝 Validator
    * 📝 Swagger Documentation
    * 📝 Models 
    * 📝 Routes 
    * 📝 Repository
    * 📝 Dedicated page on App
    * 📝 Dedicated page on Admin
* 📝 Payments
    * 📝 Validator
    * 📝 Swagger Documentation
    * 📝 Models 
    * 📝 Routes 
    * 📝 Repository
    * 📝 Dedicated page on App
    * 📝 Dedicated page on Admin
