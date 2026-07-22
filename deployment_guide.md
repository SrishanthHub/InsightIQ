# InsightIQ – Deployment Guide

Deploying a web application means moving it from your personal laptop to a public server on the internet so anyone can access it. Because InsightIQ has both a **Frontend (React)** and a **Backend (Python Flask)**, it requires a full-stack deployment approach.

---

## 🍼 The Absolute Beginner's Explanation 

### What is "Deploying"?
Right now, your app is like a **secret diary** locked inside your laptop. You can open it and write in it, but nobody else on the planet can see it. 

"Deploying" is simply the process of **copying your secret diary onto a public bulletin board**. You are renting a computer (called a "server") that stays turned on 24/7 in a giant warehouse somewhere, copying your project files onto it, and giving it a public web address (like `www.insightiq-app.com`).

Here is the absolute simplest, jargon-free way to deploy this project so your friends can use it:

#### Phase 1: Pack up your files (GitHub)
Right now, your files are on your `D:` drive. We need a safe way to move them to the internet. We use a website called **GitHub** for this. Think of GitHub as a magical Google Drive specifically built for code.
1. Go to **github.com** and create a free account. 
2. Click **New Repository** (which just means "New Folder"). Name it `InsightIQ`. 
3. Download a free program called **GitHub Desktop** to your laptop. 
4. Use GitHub Desktop to drag-and-drop your entire project folder into your new GitHub repository and click "Publish".
*Result:* All your code is now safely backed up on the internet in a private folder.

#### Phase 2: Rent the 24/7 Computer (Render.com)
Now we need to rent the computer that will run your app day and night. We will use a service called **Render**, because they give you a computer for free and they automatically connect to GitHub.
1. Go to **render.com** and sign up using your new GitHub account.
2. Click the button that says **New Web Service**.
3. Render will show you a list of your GitHub folders. Click on `InsightIQ`.
4. Render will ask you how to "turn on" your app. We'll give it the commands to install Python and React.
5. **The Secret Keys:** Remember your `GEMINI_API_KEY` hidden in your `.env` file? Render will have a section called "Environment Variables". You paste your Google API key there so the public computer has permission to use the AI.

#### Phase 3: The Hard Drive (Persistent Disk)
When you rent a free computer on Render, it's like renting an Airbnb. When you check out, the maids throw away everything you left in the fridge. If someone uploads a CSV file to your app, Render will delete it the next day when the server restarts.
To fix this, on the Render dashboard, you click a button called **Add Disk**. This is like buying a permanent mini-fridge for your Airbnb. You tell Render, "Keep all the uploaded CSV files and the SQLite database in this mini-fridge so they never get deleted."

#### Phase 4: Go Live!
Click **Deploy**. Render's robot will pull your code from GitHub, install everything, and give you a real web link (like `https://insightiq-app.onrender.com`). You can text that link to anyone in the world, and they will be able to log in and use your AI app!

---

## 🌎 1. Ways to Deploy the Project (Technical Overview)

There are three main ways to deploy a project like this. Here is a breakdown of your options:

### Option A: The PaaS Route (Easiest & Most Modern)
**Providers:** Render, Railway, Heroku
*   **How it works:** Platform-as-a-Service (PaaS) providers automatically build and run your code directly from your GitHub repository. You don't have to manage servers.
*   **Pros:** Very easy to set up, automatic SSL (HTTPS), automatic rebuilds when you push code.
*   **Cons:** Free tiers sleep when inactive. 
*   **Important Note for InsightIQ:** Because PaaS providers use "ephemeral" (temporary) storage, any CSVs uploaded or SQLite databases will be deleted every time the server restarts. To fix this, you must attach a **Persistent Disk** (offered by Render/Railway) or upgrade to PostgreSQL and AWS S3.

### Option B: The VPS Route (Most Control & Cheapest)
**Providers:** DigitalOcean Droplets, AWS EC2, Linode
*   **How it works:** You rent a bare-metal Virtual Private Server (VPS) running Linux. You manually install Python, Node.js, and a web server (like Nginx), or run everything inside Docker.
*   **Pros:** Total control, cheapest for high traffic, local files (SQLite and uploaded CSVs) are saved safely on the server's hard drive permanently.
*   **Cons:** You are responsible for security, updates, and configuring domain names/SSL certificates manually.

### Option C: The Split Route (Best for Scale)
**Providers:** Vercel / Netlify (Frontend) + Render / AWS (Backend)
*   **How it works:** You deploy the React frontend on a super-fast static host (Vercel) and host the Python backend separately.
*   **Pros:** Incredible frontend speed worldwide.
*   **Cons:** Can be trickier to set up CORS (Cross-Origin Resource Sharing) between the two domains.

---

## 🚀 2. Recommended Step-by-Step Deployment (Render.com)

The easiest way to deploy InsightIQ *without* having to rewrite your SQLite database or file upload logic is to use **Render.com** with a **Background Worker / Web Service** and a **Persistent Disk**.

### Step 1: Prepare the Code for Production

1.  **Frontend Build:** 
    Right now, you run `npm run dev`. For production, you need to compile the React code.
    *   In the frontend, update `API_BASE_URL` in your API files to point to your future live backend URL (e.g., `https://insightiq-backend.onrender.com/api/v1`) instead of `localhost:5000`.
    *   Run `npm run build` to generate the production HTML/JS files.

2.  **Backend Server:** 
    Flask's built-in server is not meant for production. You need a production server like `gunicorn`.
    *   Add `gunicorn` to your `requirements.txt`.
    *   Ensure your Flask app serves the built frontend React files (the `dist` folder) so you only have to host one application.

### Step 2: Push to GitHub

1.  Create a free account on GitHub.
2.  Initialize a Git repository in your `Project_S` folder.
3.  Commit your code and push it to a new private repository on GitHub.

### Step 3: Set up Render

1.  Go to [Render.com](https://render.com/) and create a free account.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select your `InsightIQ` repository.

### Step 4: Configure the Render Web Service

Fill in the deployment settings:
*   **Name:** `insightiq-app`
*   **Environment:** `Python`
*   **Build Command:** `pip install -r requirements.txt && npm install --prefix src/frontend && npm run build --prefix src/frontend` 
    *(This installs Python libraries AND builds the React frontend in one go)*
*   **Start Command:** `gunicorn src.backend.app:app`

### Step 5: Add a Persistent Disk (CRITICAL)

Because InsightIQ uses SQLite and saves uploaded CSVs to a local folder, you *must* add a disk to prevent data loss.
1.  Scroll down to **Advanced**.
2.  Click **Add Disk**.
3.  **Name:** `insightiq-data`
4.  **Mount Path:** `/opt/render/project/src/data` (This matches your backend's save folder).
5.  *Note: Render charges ~ $0.25/month for a basic disk.*

### Step 6: Add Environment Variables

In the **Environment** section, add your secret keys:
*   `GEMINI_API_KEY` = `your-actual-api-key-here`
*   `JWT_SECRET_KEY` = `generate-a-long-random-string-here`

### Step 7: Deploy!

1.  Click **Create Web Service**.
2.  Render will pull your code, run the build commands, and start the Gunicorn server.
3.  Once the logs say "Live", Render will give you a public URL (e.g., `https://insightiq-app.onrender.com`).
4.  Visit the URL — your app is now live on the internet!

---

## 🛠️ Summary of Required Code Changes Before Deploying

Before executing the steps above, you would need to make these minor tweaks to the codebase:

1.  **Serve React from Flask:** Modify `src/backend/app.py` so that if a user visits the root URL `/`, Flask returns the compiled React `index.html`.
2.  **Dynamic Frontend API URLs:** Modify `src/frontend/src/services/api/*.ts` to use `window.location.origin + '/api/v1'` instead of hardcoding `http://localhost:5000`.
3.  **Requirements:** Ensure `gunicorn` is in `requirements.txt`.
