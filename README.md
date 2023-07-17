# Node-Redis-OTP--Secure-User-Authentication-and-Password-Recovery-with-OTP-Validation

This README file provides a comprehensive overview of the API endpoints and their functionalities for the Node.js, Express.js, and Redis-implemented secure user authentication project. The project utilizes microservices, RESTful APIs, logging and monitoring, database integration, error handling, and authentication and authorization mechanisms to ensure scalability, security, and ease of maintenance.

![Example Image](./shared/assets/OtpVerificationImage.jpg)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Dependencies](#dependencies)
- [License](#license)

## Introduction

This project showcases a secure user authentication suite which can be used in building scalable and modular backend systems. This project focuses on secure login, sign-up, and OTP-validated password reset options. Below, you will find details about each API endpoint/Middlewares used along with their descriptions and request/response information.

## Middleware

The project includes several middleware components that enhance the functionality and security of the API Gateway service:

- Response Time Middleware: Measures the response time of each request and adds it to the response headers.

- Morgan Middleware: Logs HTTP requests to the console, providing useful information for debugging and monitoring.

- Helmet Middleware: Sets various security-related HTTP headers to protect the API from common vulnerabilities.

- JWT Middleware: Handles JSON Web Token (JWT) authentication, ensuring secure access to protected routes.

- DDoS Middleware: Provides protection against Distributed Denial-of-Service (DDoS) attacks by limiting request rates.

- Body Parser Middleware: Parses incoming request bodies in JSON format, allowing easy access to request data.

Feel free to explore the individual middleware modules located in the 'Middlewares/Gateway-Middlewares' directory for more details on their implementation and usage.

## API Endpoints

The API Gateway service includes multiple endpoints that interact with various microservices. Each endpoint is associated with specific rate-limiting middleware and request processing logic. Here are the details of the endpoints:

## API Endpoints

The base URL for all endpoints is `/routes/userAuthentication/`, and the API supports JSON data format for both request and response.

### 1. `/Register-user`

- Method: POST
- Description: Creates a new user account by providing personal details in the request body. Upon successful registration, the user can use the same credentials to log in to the system.
- Parameters:
  - `userName` (string, required): The user's username.
  - `email` (string, required): The user's email address.
  - `password` (string, required): The user's password.
  - `phoneNo` (string, required): The user's phone number.
- Responses:
  - `200`: User account created successfully.
  - `409`: Conflict. Username already exists.
  - `503`: Create new user process failed. Internal error in the process layer.
- Sample Request:

```
{
  "userName": "Anirudh.Nayak",
  "email": "myMail.example@example.com",
  "password": "iWillNotTellYou9934",
  "phoneNo": "9999999999"
}
```

- ProcessLogic:

        1. Hashes the provided password using bcrypt to securely store it in the system.

        2. Checks if the provided username already exists in the system.

        3. If the username already exists, it throws a Conflict error indicating that the username is already taken.

        4. If the username is available, it saves the user's details, including the username, email, hashed password, and phone number, in the system.

        5. Additionally, it stores the username and password separately for use in the forgot password functionality.
## Features

- **Microservices**: The architecture is based on microservices, where each service represents a specific business functionality or feature.
- **RESTful APIs**: Each microservice exposes RESTful APIs for communication and interaction with other services.
- **Logging and Monitoring**: Built-in logging and monitoring capabilities are implemented to track service performance and troubleshoot issues.
- **Database Integration**: Services integrate with appropriate databases for data storage and retrieval.
- **Error Handling**: Error handling mechanisms are implemented to provide meaningful error messages and handle exceptions gracefully.
- **Authentication and Authorization**: Services implement authentication and authorization mechanisms to ensure secure access to resources.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
```  
   git clone https://github.com/anirudh-nayak-172k/Backend-Microservice -Architecture.git
```  

2 . Navigate to the Directory and install the dependencies:
```
    cd Backend-Microservice-Architecture
    npm install
```

3 . Run the startDev script to start the application

```    
    npm run startDev
   
```
4 . Access the APIs:
Each service exposes its own set of APIs.

5. To see the Logs:

```    
    npm run displayLogs
   
```
 6. To stop the application entirely,

```    
    npm run kill
   
```
## Directory Structure

    server
        ├── API-Gateway
        │   └── src
        │       ├── app.js
        │       ├── Microservice-Routers
        │       │   └── microserviceRouters.js
        │       └── Middlewares
        │           ├── Gateway-Middlewares
        │           │   ├── ddos.middleware.js
        │           │   ├── helmet.middleware.js
        │           │   ├── jwt.middleware.js
        │           │   ├── morgan.middleware.js
        │           │   └── responseTime.middleware.js
        │           └── Route-Middlewares
        │               └── expressRateLimit.middleware.js
        |
        ├── shared
        │   └── src
        │       ├── configurations
        │       │   ├── logger.configurations.js
        │       │   └── redis.configurations.js
        │       ├── constants
        │       │   └── constants.js
        │       ├── models
        │       │   └── models.js
        │       └── utilities
        │           └── utilities.js
        |── sub-systems
        |    ├── Microservice-1
        |    │   ├── Processes
        |    │   │   └── process.js
        |    │   └── Process-Mappers
        |    │       └── processMappers.js
        |    ├── Microservice-2
        |    │   ├── Processes
        |    │   │   └── process.js
        |    │   └── Process-Mappers
        |    │       └── processMappers.js
        |    └── Microservice-3
        |        ├── Processes
        |        │   └── process.js
        |        └── Process-Mappers
        |            └── processMappers.js
        |
        ├── ecosystem.config.js
        ├── package.json
        ├── package-lock.json

## Scripts

    npm startDev: Starts the services using PM2 in development mode.
    
    npm start: Starts the API Gateway service.
    
    npm kill: Stops all running PM2 processes.
    
    npm monitor: Monitors the PM2 processes.
    
    npm displayLogs: Displays the logs from PM2 processes.
    
    npm test: Runs the test scripts.

## Dependencies

    Express: Fast, unopinionated, minimalist web framework for Node.js.
    
    Body Parser: Node.js body parsing middleware.
    
    Bunyan: Logging library for Node.js.
    
    Bunyan Format: Human-readable bunyan log formatter.
    
    DDoS: DDoS protection middleware for Express.js.
    
    Dotenv: Loads environment variables from a .env file.
    
    Helmet: Secure your Express apps by setting various HTTP headers.
    
    Joi: Object schema validation for Node.js. 
    
    JSONWebToken: JSON Web Token implementation for Node.js.
    
    Morgan: HTTP request logger middleware for Node.js.
    
    Nodemon: Automatically restarts the server on file changes during   development.
    
    PM2: Production process manager for Node.js applications.
    
    Express Rate Limit: Rate limiting middleware for Express.js.
    
    Redis: In-memory data structure store used as a database and cache.
    
    Rate Limit Redis: Redis-based store for express-rate-limit middleware.
    
    Response Time: Express.js middleware to record response times.

## License

    This project is licensed under the MIT License.
