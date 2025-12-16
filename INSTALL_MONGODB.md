# How to Install MongoDB

The "buffering timed out" error occurs because the backend cannot connect to a MongoDB database. You need to install and run MongoDB locally.

## Windows Installation

1.  **Download**: Visit the [MongoDB Community Server Download page](https://www.mongodb.com/try/download/community).
2.  **Install**: Download the MSI installer and run it.
    *   Select "Complete" setup.
    *   **Important**: Check the box "Install MongoDB as a Service". This ensures it runs automatically.
3.  **Verify**: Open PowerShell and run:
    ```powershell
    mongod --version
    ```
    Or check if the service is running:
    ```powershell
    Get-Service MongoDB
    ```

## Alternative: MongoDB Atlas (Cloud)

If you prefer not to install it locally:

1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Get your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/...`).
4.  Update `backend/.env`:
    ```env
    MONGODB_URI=your_connection_string_here
    ```

After installing or configuring, restart the backend:
```powershell
cd backend
npm run dev
```
