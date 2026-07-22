# InsightIQ – Project Documentation

Welcome to the complete, beginner-friendly guide to the **InsightIQ** project! This document breaks down the entire application, file by file and section by section, explaining what everything does, how it works, and why it was built this way.

---

## 🌟 1. Project Overview

### What the project is about
InsightIQ is an AI-powered data analytics web application. It allows users to upload raw data files (like CSVs or Excel spreadsheets) and instantly generates beautiful dashboards, provides time-series forecasting, allows for data cleaning (wrangling), and features an AI chatbot that can answer questions about the uploaded data in plain English.

### The Problem It Solves
Normally, analyzing data requires writing complex Python code, writing SQL queries, or buying expensive software like Tableau or Power BI. InsightIQ solves this by making data analysis as easy as uploading a file and chatting with an AI. It democratizes data science for everyone.

### High-Level Architecture
The project is built on a modern **Client-Server Architecture**:
1.  **The Client (Frontend):** A React.js web application running in the user's browser. It handles the UI, draws charts, and takes user inputs.
2.  **The Server (Backend):** A Python Flask API running on the server. It handles file uploads, connects to the database, talks to the AI, and performs heavy data calculations using Pandas.
3.  **The Brain (AI Engine):** Google's Gemini AI model, which processes natural language queries and returns insights about the data.

---

## ⚙️ 2. Backend Files

The backend acts as the engine room of the application. It receives requests from the frontend, processes data, and sends the results back.

### Purpose of server code
-   **File:** `src/backend/app.py`
-   **Tech Stack:** Python, Flask, Flask-CORS
-   **Reason for choice:** Flask is lightweight, incredibly fast to set up, and integrates perfectly with Python's massive data science ecosystem (like Pandas and NumPy).
-   **Beginner-friendly explanation:** Think of `app.py` as the traffic cop. When your browser asks the server to "log me in" or "show me my data", this file looks at the request and directs it to the right place to be handled.

### Database Connection Files
-   **File:** `src/backend/models/database.py`
-   **Tech Stack:** SQLite, SQLAlchemy (ORM)
-   **Reason for choice:** SQLite is a serverless database that stores everything in a simple file (`insightiq.db`). This makes it incredibly easy to set up and perfect for local MVP development without needing to configure complex database servers like PostgreSQL. SQLAlchemy allows us to interact with the database using Python code instead of raw SQL strings.
-   **Beginner-friendly explanation:** This is the digital filing cabinet. It securely stores user accounts (emails and hashed passwords) and the metadata about the uploaded datasets (who uploaded what, and where the file is saved on the hard drive).

### API Routes and their role
-   **Files:** `src/backend/api/auth_router.py`, `dataset_router.py`, `chat_router.py`, `wrangling_router.py`, `forecasting_router.py`
-   **Tech Stack:** Flask Blueprints
-   **Reason for choice:** Grouping related routes into "Blueprints" keeps the code organized. Instead of one massive 2,000-line file, we have neat, organized folders.
-   **Beginner-friendly explanation:** These are the specific departments in our factory. 
    -   `auth_router` handles checking IDs (login/register).
    -   `dataset_router` handles the delivery truck (uploading/downloading files).
    -   `chat_router` talks to the smart AI assistant.
    -   `wrangling_router` cleans up messy data.

---

## 🎨 3. Frontend Files

The frontend is everything the user sees, clicks, and interacts with on their screen.

### Purpose of React.js Components
-   **Files:** `src/frontend/src/App.tsx`, `pages/`, `components/`
-   **Tech Stack:** React.js, TypeScript, Tailwind CSS, Recharts (for charts), Lucide React (for icons)
-   **Reason for choice:** 
    -   **React:** Allows us to build the UI as reusable "components" (like lego blocks) that update instantly without reloading the page.
    -   **Tailwind CSS:** Allows us to style elements rapidly by writing classes directly in the HTML, avoiding messy CSS files.
    -   **TypeScript:** Adds strict rules to JavaScript, preventing bugs before the code even runs.
-   **Beginner-friendly explanation:** React is the paint, the buttons, and the screens. `App.tsx` is the main container. The `pages/` folder holds entire screens (like the Login Page or Dashboard Page). The `components/` folder holds smaller, reusable pieces (like a single KPI card or a navigation sidebar).

### How UI interacts with backend
-   **Files:** `src/frontend/src/services/api/` (e.g., `datasetApi.ts`, `explorerApi.ts`)
-   **Tech Stack:** Axios
-   **Reason for choice:** Axios is a promise-based HTTP client that makes sending requests to the backend API simple and automatically handles JSON data.
-   **Beginner-friendly explanation:** Axios acts like a waiter in a restaurant. When you click "Upload" in the React UI (the customer), Axios takes your file, runs to the kitchen (the Flask Backend), waits for the kitchen to finish processing it, and brings the response (success or failure) back to your screen.

---

## 🧠 4. AI/ML Files

This section handles the smart features: chatting with data and predicting the future.

### Data Preprocessing
-   **Files:** `src/backend/core/data_processor.py`, `wrangling_engine.py`
-   **Tech Stack:** Pandas, NumPy
-   **Reason for choice:** Pandas is the gold standard for data manipulation in Python. It handles missing values, filters rows, and calculates statistics incredibly fast.
-   **Beginner-friendly explanation:** Imagine a massive Excel spreadsheet with a million rows. Pandas is like an ultra-fast robot accountant that can read the whole thing, fix typos, fill in blank cells, and summarize it in a fraction of a second.

### AI Engine / Retrieval System
-   **File:** `src/backend/core/ai_engine.py`
-   **Tech Stack:** Google Gemini API (`google-genai` SDK)
-   **Reason for choice:** Gemini 2.5 Flash is incredibly fast, highly capable of understanding tabular data, and cost-effective. We pass statistical summaries of the Pandas data to the LLM so it understands the context without exposing raw, massive datasets.
-   **Beginner-friendly explanation:** This is the brain. When you ask "What is the total revenue?", the AI engine converts your dataset into a small summary, hands it to Google Gemini, and Gemini reads it to type back a perfect, human-sounding answer. 

*(Note: We don't train custom TensorFlow/PyTorch models here because pre-trained Large Language Models (LLMs) like Gemini are already smart enough to handle data Q&A out-of-the-box!)*

---

## 🛠️ 5. Utility Files

These files configure the project and keep secrets safe.

### Configurations and Environment Variables
-   **File:** `.env` and `requirements.txt` / `package.json`
-   **Tech Stack:** python-dotenv, npm
-   **Reason for choice:** Standard practice for keeping sensitive data (like API keys) out of the source code.
-   **Beginner-friendly explanation:** 
    -   `.env`: This is a hidden safe. It holds your secret `GEMINI_API_KEY` and JWT Passwords. By keeping this in a separate file, hackers can't find your keys if they look at your code.
    -   `requirements.txt`: A shopping list for the Python backend. It tells the server exactly which libraries to download (like Flask and Pandas).
    -   `package.json`: A shopping list for the React frontend (tells it to download React, Tailwind, etc).

### Authentication 
-   **File:** `src/backend/api/auth_router.py` (JWT Logic)
-   **Tech Stack:** JSON Web Tokens (JWT), Werkzeug Security
-   **Reason for choice:** JWTs are stateless. The server doesn't have to remember who is logged in; the token itself proves who the user is.
-   **Beginner-friendly explanation:** When you log in, the server gives you a digital "VIP wristband" (the JWT token). Every time you click a new page or request data, you show the wristband. If the wristband is valid, you get in!

---

## 🚀 6. Deployment Files (Future Setup)

While InsightIQ currently runs locally, moving it to the cloud requires specific configurations.

### Docker Setup & Deployment Scripts
-   **Files (Planned):** `Dockerfile`, `docker-compose.yml`, `.github/workflows/deploy.yml`
-   **Why containerization was chosen:** Docker packages the entire application (Python, Node.js, the database) into a neat little box called a container. This guarantees that if the app works on your laptop, it will work exactly the same way on a cloud server (like AWS or Google Cloud).
-   **Beginner-friendly explanation:** Imagine trying to move a fully furnished living room across the country. Instead of moving every chair and TV one by one (and hoping they fit in the new house), Docker shrinks the entire room into a magic shipping container. When you put the container on a new server and open it, the living room is instantly set up and ready to use exactly as it was.

---

### End of Documentation
*Generated for the InsightIQ Project*
