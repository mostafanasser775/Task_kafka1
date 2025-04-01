# Kafka Producer and Consumer for User Activity Logs

This project uses Kafka to handle user activity logs. It includes a producer to send logs and two consumers to process them, storing the results in MongoDB. Everything is set up to run with Docker.

## Prerequisites

Here's what you'll need installed before you start:

* Docker (to run Kafka and the services)
* Node.js (to run the producer and consumers)
* A MongoDB instance (running locally or from a service)

## Running Kafka

Kafka runs in Docker using the official Bitnami image. Here’s how to start it:

1.  Go into the `docker` folder in the project.
2.  Run this command:
    ```bash
    docker-compose up -d
    ```
This command will start Kafka and anything else it needs.

## Running the Producers and Consumers

The project code is split into these folders:

* `task-producer`: Contains the producer script that sends user activity logs to Kafka.
* `user-consumer`: The first consumer script that reads logs from Kafka and saves them to MongoDB.
* `user-consumer2`: A second consumer that does the same thing as the first one.

### Running the Producer

1.  Change to the `task-producer` directory:
    ```bash
    cd task-producer
    ```
2.  Start the producer:
    ```bash
    npm run start:dev
    ```
This will get the producer running, and it will start sending logs.

### Running the Consumers

1.  For the first consumer, go to its folder:
    ```bash
    cd user-consumer
    ```
2.  Start the first consumer:
    ```bash
    npm run start:dev
    ```
3.  For the second consumer, go to its folder:
    ```bash
    cd user-consumer2
    ```
4.  Start the second consumer:
    ```bash
    npm run start:dev
    ```
Now both consumers will be running, processing messages from Kafka and saving data to MongoDB.

## MongoDB Configuration

You need to tell the consumers how to connect to your MongoDB database.

1.  In both the `user-consumer` and `user-consumer2` folders, find the `.env` file.
2.  Inside each `.env` file, update the `MONGO_URI` variable with your MongoDB connection string.

## REST API Endpoints

The project also provides a couple of REST API endpoints to manage users (likely served by the `task-producer` service).

### POST /user

Use this endpoint to create a new user.

* **Required JSON fields:** `name`, `email`, `password`
* **Example Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

### GET /user

Use this endpoint to retrieve users, with options to filter and paginate.

* **Optional Query Parameters:**
    * `email`: Filter by a specific email address.
    * `name`: Filter by name.
    * `limit`: Set the maximum number of users to return.
    * `page`: Specify the page number for pagination.
* **Example Request URL:**
    ```
    http://localhost:3000/user?email=john@example.com&limit=10&page=1
    
