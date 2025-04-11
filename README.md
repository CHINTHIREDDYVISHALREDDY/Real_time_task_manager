# Real-Time Work Distribution System

## 🚀 Project Overview
A real-time task assignment and tracking system designed for collaborative teams with role-based access. 
This project was built for a hackathon to demonstrate real-time data pipelines, scalable filtering, and client-specific task visibility.

## 👥 Roles & Features

- *Admin*: Create and assign tasks, manage visibility
- *Team Leads*: Monitor team member tasks, receive updates
- *Team Members*: View and update tasks assigned to them
- *Clients*: Track the progress of their requested work

## 🔧 Tech Stack

- *Backend*: FastAPI, Motor (MongoDB async driver)
- *Frontend*: [React/Vite or HTML/JS - update based on your stack]
- *Database*: MongoDB
- *Real-Time*: WebSocket API over FastAPI
- *Auth*: JWT-based user authentication and role checks

## 📦 Folder Structure


/frontend       → Client-side UI per role
/backend        → FastAPI WebSocket server + DB integration
/utils          → Helpers and WebSocket filters


## 🛠 Setup Instructions

bash
# Clone the repo
git clone https://github.com/your-username/your-repo-name.git

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Run the backend
uvicorn main:app --reload

# Run frontend (React)
cd frontend
npm install
npm run dev


## 📈 Live Features
- Real-time task updates per user via WebSocket
- Role-based filtering using task metadata (assigned_to, visible_to)
- Scalable document schema with JSON-style storage

---

Built for Nutanix Hackathon 🚀
