# MisterToy Backend

A Node.js backend API server for the MisterToy application, built with Express.js.

## 🚀 Live API

**API Base URL:** [https://mistertoy-backend-8pc5.onrender.com](https://mistertoy-backend-8pc5.onrender.com)  
**API Documentation:** [https://mistertoy-backend-8pc5.onrender.com/api/debug](https://mistertoy-backend-8pc5.onrender.com/api/debug)

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables in `.env`:**
   ```env
   # MongoDB Configuration
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
   MONGODB_DB_NAME=your_database_name
   
   # Server Configuration
   PORT=3030
   NODE_ENV=development
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run server:dev    # With environment file
   npm run dev:win       # Windows (legacy)
   npm run dev:mac       # Mac/Linux (legacy)
   npm start             # General
   ```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run server:dev      # Recommended (with .env file)
npm run dev:win         # Windows
npm run dev:mac         # Mac/Linux
npm start               # General
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

## Security Notes

⚠️ **IMPORTANT:** Never commit sensitive credentials to version control!

- The `.env` file is already included in `.gitignore`
- Use `.env.example` as a template for other developers
- For production deployment, set environment variables in your hosting platform
- Rotate database credentials if they were previously exposed

## Deployment

This backend is deployed on [Render.com](https://render.com/) as a Web Service:

- **Environment:** Production
- **Database:** MongoDB Atlas (cloud database)
- **Environment Variables:**
  - `NODE_ENV`: production
  - `MONGODB_URL`: Set in Render environment variables
  - `MONGODB_DB_NAME`: Set in Render environment variables

## Technologies

- Node.js
- Express.js
- MongoDB Atlas
- ES6 Modules
- Cookie-based authentication
