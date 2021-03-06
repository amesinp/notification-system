# HTTP Notification System

Simple HTTP notification system that allows subscription to topics and publishes to all the subscribers of a topic whenever anything is published to the topic.

## Prerequisites

- Node.js (https://nodejs.org/en/)
- Postgres (https://www.postgresql.org/)
- Docker (https://docs.docker.com/get-docker/)

## How to Start

### Using Docker

- Run `docker-compose up`

### Manually

- Install dependencies using `npm install` command
- Create a new file named `.env` using `.env.example` as a guide and setup the environment variables
- Run database migrations
  - For development environments: `npm run migrations:dev`
  - For non-development environemnts: `npm run migrations:deploy`
- Run `npm run dev` to start a development server or `npm start` to start a production server

## Run Integration Tests

### Using Docker

- Run `npm run test:docker`

### Manually

- Create a test database for the integration test
- Run `DATABASE_URL='postgres://URL_TO_TEST_DATABASE' npm test`
