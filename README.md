# Chat App Documentation

## Overview

This is a simple chat application built with NestJS and MongoDB. The application consists of three services:

1. **MongoDB Service:** A MongoDB container to store chat data.
2. **App Service:** The NestJS application that handles the chat functionality and communicates with the MongoDB service.
3. **Web Service:** An Nginx web server serving a basic HTML page to interact with the chat app.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-chat-app.git
    cd your-chat-app
    ```

2. **Create a `.env` file** in the root of the project and add the following content:

    ```dotenv
    MONGO_URI=mongodb://mongo:27017/chat-app
    ```

    This environment variable is used by the NestJS app to connect to the MongoDB service.

3. **Run the Docker Compose:**

    ```bash
    docker-compose up -d
    ```

    This command will build and start the three services defined in the `docker-compose.yml` file.

4. **Access the chat app:**

    Open your web browser and navigate to [http://localhost:8080](http://localhost:8080) to access the chat application.
    To See the backend api documentation you can go to [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## Stopping the App

To stop the application and remove the containers, run the following command:

```bash
docker-compose down
```
