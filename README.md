# Task App

This is a simple task management application built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup, login, logout)
- Create, read, update, delete tasks
- Store tasks in a MongoDB database
- RESTful API endpoints for tasks

## Installation

1. Clone this repository:

```bash
git clone <repository_url>
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=3000
MONGODB_URI=<your_mongodb_connection_uri>
JWT_SECRET=<your_jwt_secret_key>
```

Replace `<your_mongodb_connection_uri>` with your MongoDB connection URI and `<your_jwt_secret_key>` with your JWT secret key.

4. Run the application:

```bash
npm start
```

The application will start on `http://localhost:3000` by default.

## API Endpoints

### Tasks

- `GET /tasks`: Get all tasks
- `GET /tasks/:id`: Get a single task by ID
- `POST /tasks`: Create a new task
- `PATCH /tasks/:id`: Update a task
- `DELETE /tasks/:id`: Delete a task

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT) for authentication

## Contributing

Contributions are welcome! Feel free to submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
