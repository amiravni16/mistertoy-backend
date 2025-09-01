# MisterToy Backend

A Node.js backend API server for the MisterToy application, built with Express.js.

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

## Technologies

- Node.js
- Express.js
- ES6 Modules
- Cookie-based authentication
