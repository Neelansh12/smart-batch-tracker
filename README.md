# Smart Batch Tracker

A full-stack **MERN** (MongoDB, Express, React, Node.js) application for tracking measurement batches.

## Project Structure

This project has been restructured into a monorepo-style layout:

-   [`frontend/`](./frontend) - React application (Vite + local API)
-   [`backend/`](./backend) - Node.js + Express API

## Prerequisites

-   **Node.js** (v18 or higher)
-   **MongoDB Atlas Connection String** (Setup in `backend/.env`)

## Installation & Setup

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Start the backend server:

```bash
npm start
```

Runs on **Port 5000**.
Connects to **MongoDB Atlas**.

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Runs on **http://localhost:3000**.

## Configuration

### Backend Environment (`backend/.env`)

```env
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend Configuration

The frontend is pre-configured to communicate with the backend at `http://localhost:5000/api`.
Authentication is handled via JWT tokens stored in local storage.

## Features

-   **MERN Stack**: Pure JavaScript full-stack architecture.
-   **Authentication**: Custom Node.js auth (Login/Signup).
-   **Cloud Database**: Data stored securely in MongoDB Atlas.
-   **Modern UI**: Built with React, Tailwind CSS, and Shadcn UI.
