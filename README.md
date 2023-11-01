# ABC School Employee Attendance API

This API is used to manage employee check-ins and check-outs at ABC School, tracking attendance and calculating the duration of each work period.

## Features

- Create new employees
- Retrieve a list of employees with optional filters by date of creation
- Check-in employees to track attendance start
- Check-out employees to track attendance end and calculate the duration

Additionally, the API is fully documented using OpenAPI and Swagger UI. This documentation provides a clear and interactive way of understanding the available endpoints, their required parameters, and the structure of the expected responses.

## API Documentation

To access the interactive API documentation:

1. Start the API server on your local machine.
2. Open a web browser and navigate to `http://localhost:3000/api`.
3. The Swagger UI will be displayed, allowing you to test endpoints directly through the browser.

By using Swagger UI, you can:

- Explore the list of available endpoints.
- Send test requests to the API and view the responses.
- Review the request models and response schemas.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Nodejs version v16.19.0 or higher (we recommend using nvm).
- Git.
- Docker (optional, for running the database in a container).
- Nestjs.

### Installing

Clone the repository:

```sh
git clone https://github.com/abderrahmaneMustapha/abc-school-attendance.git
cd abc-school-attendance
```

Install dependencies:

```sh
npm install
```

## Running with Docker

To facilitate a consistent development environment and simplify the production deployment process, this project is configured to run with Docker.

### Development Environment Setup

For local development, we run only the database service in Docker, while the application runs on the host machine.

#### Setting Up the Database with Docker

Create a `.env.dev` file with the necessary environment variables:

```env
NODE_ENV=development
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ABC-test-user
DB_PASSWORD=test123
DB_DATABASE=ABC-test
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
TYPEORM_AUTO_LOAD_ENTITIES=true
POSTGRES_DB=dev-db
POSTGRES_USER=dev-user
POSTGRES_PASSWORD=dev-pass
```

Start the database with Docker Compose:

```sh
docker-compose -f docker-compose.dev.yml up -d
```

#### Running the Application for Development

Start the application on your local machine with:

```sh
npm run start:dev
```

### Production Environment Setup

In production, both the application and the database run in Docker containers.

#### Setting Up the Production Environment

Create a `.env.prod` file with the production environment variables:

```env
NODE_ENV=production
DB_TYPE=postgres
DB_HOST=db
DB_PORT=5432
DB_USERNAME=ABC-test-user
DB_PASSWORD=test123
DB_DATABASE=ABC-test
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=true
TYPEORM_AUTO_LOAD_ENTITIES=true
POSTGRES_DB=ABC-test
POSTGRES_USER=ABC-test-user
POSTGRES_PASSWORD=test123
```

Build and start the production containers with Docker Compose:

```sh
docker-compose up --build -d
```

## Configuration

Configure your database connection settings in `.env.dev` for developement and
`.env.prod` or directly in the TypeORM configuration in `src/app.module.ts`.

## Tests

Run the unit tests for this system using:

```sh
npm run test
```

For integration tests  you first need to prepare a new `.env.test` file:

```env
NODE_ENV=test
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=test-user
DB_PASSWORD=test123
DB_DATABASE=test-db
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
TYPEORM_AUTO_LOAD_ENTITIES=true
POSTGRES_DB=test-db
POSTGRES_USER=test-user
POSTGRES_PASSWORD=test123
```

After this you build and start the production containers with Docker Compose:

```sh
docker-compose -f docker-compose.spec.yml up -d
```

And then you can run your integration tests by doing:

```sh
npm run test:e2e
```

## Authors

- Abderahmane Toumi - abderrahmaneMustapha
