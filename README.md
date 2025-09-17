# MisterToy Backend

A Node.js backend API server for the MisterToy application, built with Express.js.

## 🚀 Live API

**API Base URL:** [https://mistertoy-backend-8pc5.onrender.com](https://mistertoy-backend-8pc5.onrender.com)  
**API Documentation:** [https://mistertoy-backend-8pc5.onrender.com/api/debug](https://mistertoy-backend-8pc5.onrender.com/api/debug)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev:win    # Windows
npm run dev:mac    # Mac/Linux
npm start          # General
```

## API Endpoints

- `GET /api/toy` - Get all toys with filtering
- `GET /api/toy/:id` - Get toy by ID
- `POST /api/toy` - Create new toy (auth required)
- `PUT /api/toy/:id` - Update toy (auth required)
- `DELETE /api/toy/:id` - Delete toy (auth required)
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

## Sample Users

- `puki` / `puki` (Puki Ja)
- `admin` / `admin` (Admin User)
- `muki` / `secret2` (Muki Ba)

## Project Structure

```
├── services/          # Business logic
├── data/             # JSON data storage
├── public/           # Static files
├── logs/             # Application logs
└── server.js         # Main server file
```

## Deployment

This backend is deployed on [Render.com](https://render.com/) as a Web Service:

- **Environment:** Production
- **Database:** MongoDB Atlas (cloud database)
- **Environment Variables:**
  - `NODE_ENV`: production
  - Database connection configured for Atlas

## Technologies

- Node.js
- Express.js
- MongoDB Atlas
- ES6 Modules
- Cookie-based authentication
