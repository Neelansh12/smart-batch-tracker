# Backend for Smart Batch Tracker

This is the Express/Mongoose backend replacing Supabase.

## Setup

1.  Navigate to `backend` directory: `cd backend`
2.  Install dependencies: `npm install` (Done)
3.  Ensure MongoDB is running locally on port 27017.
4.  Start the server: `npm run dev`

## Configuration

Edit `.env` to change MongoDB URI or JWT Secret.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/me`
- `GET/POST/PUT/DELETE /api/batches`
- `GET/POST/DELETE /api/alerts`
- `POST /api/quality` (Uploads)

## Uploads

Uploaded images are stored in `backend/uploads`.
