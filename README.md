# TaskFlow - A To-Do List Application

TaskFlow is a full-stack web application designed to help you manage your tasks efficiently. It features a user-friendly interface and a robust backend to handle all your to-do list needs.

## ✨ Features

- **User Authentication**: Secure user registration and login system.
- **CRUD Functionality**: Create, Read, Update, and Delete tasks.
- **RESTful API**: A well-structured backend API for managing data.
- **Responsive Design**: A clean and responsive UI that works on all devices.

## 🛠️ Tech Stack

### Backend

- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment.
- **[Express.js](https://expressjs.com/)**: Web framework for Node.js.
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database for storing data.
- **[Mongoose](https://mongoosejs.com/)**: Object Data Modeling (ODM) library for MongoDB.
- **[JSON Web Tokens (JWT)](https://jwt.io/)**: For securing API endpoints.
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: For password hashing.
- **[CORS](https://www.npmjs.com/package/cors)**: For enabling Cross-Origin Resource Sharing.
- **[Dotenv](https://www.npmjs.com/package/dotenv)**: For managing environment variables.

### Frontend

_(You can update this section with your frontend technologies)_

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **CSS / Styled Components**: For styling the application.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local installation or a cloud instance like MongoDB Atlas)

### Backend Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/task-flow.git
    cd task-flow/backend
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

## API Endpoints

The backend provides the following RESTful API endpoints:

#### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user.

#### Tasks

- `GET /api/tasks`: Get all tasks for the logged-in user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update an existing task.
- `DELETE /api/tasks/:id`: Delete a task.

## 📁 Project Structure

```
task-flow/
├── backend/         # Express.js backend code
│   ├── node_modules/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js    # Main server file
└── frontend/        # React frontend code (or your choice of framework)
```

## 👤 Author

- **Rinu Manoj**
- **Niriksha G Shetty**

## 🔗 Live Link
- **Frontend:** (https://task-flow-frontend-f6h0.onrender.com/)[https://task-flow-frontend-f6h0.onrender.com/]
- **Backend:** (https://task-flow-o7vf.onrender.com/)[https://task-flow-o7vf.onrender.com/]

- **Rinu Manoj**
- **Niriksha G Shetty**

## 📄 License

This project is licensed under the ISC License.ISC License

Copyright (c) 2025 Rinu Manoj

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

**THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.**