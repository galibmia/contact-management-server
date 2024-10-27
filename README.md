
# Contact Management App - Backend

This is the backend for the Contact Management App, built using Node.js and Express. It provides RESTful APIs for managing contacts, including creating, reading, updating, and deleting contacts.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Testing the API](#testing-the-api)

## Technologies Used
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens) for authentication
- Dotenv for environment variables

## Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/contact-management-app-backend.git
   cd contact-management-app-backend
   ```

2. **Install Dependencies**:
   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and set the following variables:
   ```plaintext
   PORT=5000
   MONGO_URI=<your_mongo_database_connection_string>
   JWT_SECRET=<your_jwt_secret_key>
   ```

## API Endpoints
### Authentication
- **POST** `/api/auth/register`: Register a new user
- **POST** `/api/auth/login`: Login an existing user

### Contacts
- **GET** `/api/contacts`: Get all contacts (requires authentication)
- **POST** `/api/contacts`: Create a new contact (requires authentication)
- **GET** `/api/contacts/:id`: Get a specific contact by ID (requires authentication)
- **PUT** `/api/contacts/:id`: Update a specific contact by ID (requires authentication)
- **DELETE** `/api/contacts/:id`: Delete a specific contact by ID (requires authentication)

## Running the Application
1. **Start the Server**:
   ```bash
   npm start
   ```

2. **Access the API**:
   The backend will run on `http://localhost:5000` by default.

3. **Testing the API**:
   You can use tools like Postman or cURL to test the API endpoints.

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, feel free to create a pull request or open an issue.

## License
This project is licensed under the MIT License.
