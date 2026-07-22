# How to Run InsightIQ

There are two main ways to run this project: using Docker (which is the easiest as it sets up the database and services for you) or setting it up manually.

## Option 1: The Easiest Way (Using Docker Compose)
The project includes a `docker-compose.yml` file which sets up the frontend, backend, PostgreSQL database, and Redis cache automatically.

1. Ensure you have Docker and Docker Compose installed.
2. Create your environment variables file based on the example (if one exists), or just create a `.env` file in the root folder.
3. Run the following command in your terminal from the `d:\Project_S` directory:
   ```bash
   docker-compose up
   ```
   *(To run it in the background, you can use `docker-compose up -d`)*

This will start:
- **Frontend** at http://localhost:3000
- **Backend API** at http://localhost:8000

---

## Option 2: Manual Local Setup
If you want to run the frontend and backend separately for development, you can do so with the following steps. You will need to ensure you have PostgreSQL and Redis running locally for the backend to work fully.

### 1. Start the Backend (Python/FastAPI)
Open a terminal and run the following commands:
```bash
# 1. Ensure you are in the project root
cd d:\Project_S

# 2. Activate the virtual environment
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# Or Command Prompt:
.venv\Scripts\activate.bat

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the backend
python -m src.backend.app
```

### 2. Start the Frontend (React/Vite)
Open a **new terminal window** and run:
```bash
# 1. Ensure you are in the project root
cd d:\Project_S

# 2. Install Node.js dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

The frontend will be available at http://localhost:5173 (or another port specified by Vite in the terminal output), and the backend at http://localhost:8000.
