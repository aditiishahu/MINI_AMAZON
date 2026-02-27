# 🛒 Scalable AI Recommender System (Mini Amazon)

A production-style scalable recommendation system inspired by Amazon.

This project demonstrates how modern e-commerce platforms generate personalized product recommendations using machine learning, backend APIs, and a responsive frontend.

---

## 👩‍💻 Team Members

- **Archita** – System Design & ML Engine
- **Ayush** – Backend Development
- **Aditi** – Frontend Development

---

## 🚀 Project Overview

The system provides personalized product recommendations based on:

- User views
- Clicks
- Purchases
- Interaction history

It follows a modular and scalable architecture separating:

- Frontend (UI Layer)
- Backend (API Layer)
- ML Engine (Recommendation Logic)
- Database (Storage Layer)

---

## 🏗 System Architecture

![System Architecture](docs/system-architecture.png)

High-Level Flow:

User  
⬇  
Frontend (React)  
⬇  
Backend API (FastAPI)  
⬇  
ML Engine (Recommendation Model)  
⬇  
Database (PostgreSQL)

Optional Scaling Components:
- Redis (Caching)
- Docker (Containerization)
- Load Balancer (Future)

---

## 🛠 Tech Stack

### 🔹 Frontend
- React
- Axios

### 🔹 Backend
- FastAPI
- PostgreSQL
- SQLAlchemy

### 🔹 ML Engine
- Python
- scikit-learn
- Pandas
- NumPy

### 🔹 DevOps (Future Scope)
- Docker
- CI/CD
- Cloud Deployment (AWS/GCP)

---

## 📂 Project Structure
- scalable-ai-recommender/
- │
- ├── frontend/ # React frontend
- ├── backend/ # FastAPI backend
- ├── ml-engine/ # ML models & training
- ├── database/ # Schema & migrations
- ├── docs/ # Architecture diagrams & docs
- └── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
- git clone <repo-url>
- cd scalable-ai-recommender


---

### 2️⃣ Backend Setup
- cd backend
- pip install -r requirements.txt
- uvicorn app.main:app --reload


---

### 3️⃣ Frontend Setup
- cd frontend
- npm install
- npm start


---

### 4️⃣ ML Engine Setup
- cd ml-engine
- python train.py


---

## 📌 Project Status

🟢 Phase 1 – System Design & Foundation  
🔵 Backend Development – In Progress  
🟣 ML Model Development – In Progress  
🟠 Frontend UI – In Progress  

---

## 🎯 Future Improvements

- Real-time recommendation updates
- Model retraining pipeline
- Caching layer
- Cloud deployment
- Microservices architecture