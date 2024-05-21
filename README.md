# Fortune Bank API

This is a study project to deeply learn integration testing, Docker, Fastify, and MongoDB. I created a very basic bank API to learn these technologies.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The things you need before installing the software.

* Docker
* Node/Npm (If you want run local)
* MongoDB (If you want run local)

### Installation

A step by step guide that will tell you how to get the development environment up and running.

##### Run with docker

You can run this project with only Docker installed on your machine. You can view the logs and receive a log file in your src directory.

* `docker compose up` (This runs Docker normally, you will see the logs in your terminal and can use the API with Postman or Insominia)
* `npm run docker` (This runs Docker in detached mode; you will not see the logs in the terminal, but you can still use the API)
* `npm run docker-d` (This runs Docker compose down; Docker will stop the containers and shut down the API)
* `npm run test` (This runs all API tests, allowing you to verify if everything is OK. You can add this command to your docker-compose file to run it with Docker)

## Usage

You can see the API documentation here: 
Postman File: https://elements.getpostman.com/redirect?entityId=31132976-022f37eb-1347-4c9b-8ecd-319b98ad1ce4&entityType=collection

