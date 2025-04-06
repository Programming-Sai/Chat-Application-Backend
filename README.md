# Chat-Application-Backend

## Overview

This is the backend for a real-time chat application built using **Node.js, Express, Postgres**, and **Socket.io**. The API provides authentication, messaging, and real-time communication features.

## Setup

### Prerequisites

- Node.js (Latest LTS version recommended)
- Postgres (Neon)
- Postman or REST Client for testing APIs

### Installation

1. Clone the repository:

   ```sh
   git clone -b postgres-db-swap https://github.com/Programming-Sai/Chat-Application-Backend.git

   cd Chat-Application-Backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory:

   ```sh
    PORT=
    PGHOST=
    PGDATABASE=
    PGUSER=
    PGPASSWORD=
    POSTGRES_DB_URL=
    MODE=development || production
    JWT_SECRET=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    FRONTEND_BASE_URL=
    BACKEND_BASE_URL=
   ```

4. Start the server:

```sh
npm run dev
```

The server should now be running on `http://localhost:5000`.

## Project Structure

```ftt


./Chat-Application-Backend/*
        ├─ src/*
        |       ├─ controllers/*
        |       |       ├─ auth.controllers.js
        |       |       └─ message.controller.js
        |       ├─ lib/*
        |       |       ├─ cloudinary.js
        |       |       ├─ db.js
        |       |       ├─ socket.js
        |       |       └─ utils.js
        |       ├─ middleware/*
        |       |       └─ auth.middleware.js
        |       ├─ models/*
        |       |       ├─ init.model.js
        |       |       ├─ message.model.js
        |       |       └─ user.model.js
        |       ├─ routes/*
        |       |       ├─ auth.route.js
        |       |       └─ message.route.js
        |       └─ index.js
        ├─ tests/*
        |       ├─ auth.tests.http
        |       └─ message.tests.http
        ├─ .env
        ├─ .env_skeleton
        ├─ .gitignore
        ├─ package-lock.json
        ├─ package.json
        └─ README.md

```

## API Endpoints

### Authentication

#### Signup a new user

```http
POST /api/auth/signup
```

**Request Body:**

```json
{
  "fullName": "Test User",
  "email": "testuser@example.com",
  "password": "Test@123"
}
```

#### Sign in an existing user

```http
POST /api/auth/signin
```

**Request Body:**

```json
{
  "email": "testuser@example.com",
  "password": "Test@123"
}
```

**Response:**

- Returns a JWT token. Use this token for authenticated requests.

#### Check authenticated user

```http
GET /api/auth/check
```

**Headers:**

```sh
Cookie: jwt=your_token_here
```

#### Logout user

```http
POST /api/auth/signout
```

**Headers:**

```sh
Cookie: jwt=your_token_here
```

---

### Messaging

#### Get all users for sidebar (excluding logged-in user)

```http
GET /api/message/users
```

#### Get messages between logged-in user and another user

```http
GET /api/message/{chat_user_id}
```

#### Send a new text message

```http
POST /api/message/send/{chat_user_id}
```

**Request Body:**

```json
{
  "text": "Hello, how are you?"
}
```

#### Send an image message

```http
POST /api/message/send/{chat_user_id}
```

**Request Body:**

```json
{
  "image": "https://example.com/sample-image.jpg"
}
```

---

### **WebSocket Events**

#### **User Connection**

- **Event:** `connection`
- **Data:** `{ userId }` (sent via `socket.handshake.query.userId`)
- **Description:** When a user connects, they are added to `userSocketMap`, and all online users are updated.

#### **Get Online Users**

- **Event:** `getAllOnlineUsers`
- **Data:** `{ userIds: [...] }`
- **Description:** Broadcasts the list of all currently connected users whenever a user connects or disconnects.

#### **User Disconnect**

- **Event:** `disconnect`
- **Description:** Removes the user from `userSocketMap` and updates the online user list.

---
