# 🎬 Movie Recommendation System

A full-stack, personalized **Movie Recommendation System** that combines **Deep Learning, collaborative filtering, FastAPI, MySQL, and a modern frontend** to recommend movies based on a user's movie preferences and rating history.

The system is designed to move beyond a static machine-learning notebook and provide a **real-world recommendation platform** where users can create accounts, select and rate movies they have watched, and receive personalized recommendations for movies they have not watched.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Project Objectives](#-project-objectives)
* [Key Features](#-key-features)
* [System Architecture](#-system-architecture)
* [High-Level Architecture](#-high-level-architecture)
* [Low-Level Architecture](#-low-level-architecture)
* [Complete Internal Flow](#-complete-internal-flow)
* [Database Architecture](#-database-architecture)
* [Machine Learning Architecture](#-machine-learning-architecture)
* [Recommendation Flow](#-recommendation-flow)
* [Authentication Flow](#-authentication-flow)
* [New Movie Handling](#-new-movie-handling)
* [API Architecture](#-api-architecture)
* [Frontend Architecture](#-frontend-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Data Flow](#-data-flow)
* [Security](#-security)
* [Cold Start Problem](#-cold-start-problem)
* [Model and Database Relationship](#-model-and-database-relationship)
* [Future Improvements](#-future-improvements)
* [Deployment Architecture](#-deployment-architecture)
* [Installation](#-installation)
* [Usage](#-usage)
* [Conclusion](#-conclusion)

---

# 🎯 Overview

Traditional movie recommendation projects often stop at:

```text
Dataset → Train Model → Predict Movies
```

This project extends that concept into a **real-world web application**:

```text
User
 ↓
Signup / Login
 ↓
Select Watched Movies
 ↓
Give Ratings
 ↓
MySQL Database
 ↓
Recommendation Engine
 ↓
Predict Unwatched Movies
 ↓
Rank Recommendations
 ↓
Display Personalized Movies
```

The application maintains a persistent database of users, movies, and ratings while the recommendation engine uses user-movie interactions to generate personalized results.

---

# ❓ Problem Statement

Users are often presented with the same popular movies regardless of their personal preferences.

A recommendation system should instead answer:

> **"Given what this particular user has watched and liked, which movies are they most likely to enjoy next?"**

The system solves this problem by learning relationships between:

```text
Users
   +
Movies
   +
Ratings
   ↓
Personalized Recommendations
```

---

# 🎯 Project Objectives

The primary objectives are:

* Build a personalized movie recommendation system.
* Implement collaborative filtering using a neural-network-based model.
* Store application data using MySQL.
* Provide user registration and authentication.
* Allow users to select movies they have watched.
* Allow users to rate watched movies.
* Store user-movie interactions permanently.
* Recommend movies that the user has not watched.
* Integrate the trained ML model with a backend API.
* Build a production-style full-stack architecture.
* Support adding new movies to the application database.

---

# ✨ Key Features

### 👤 User Management

* User registration
* Unique user ID generation
* Login authentication
* Password hashing
* Persistent user accounts

### 🎬 Movie Management

* Movie catalog
* Unique movie IDs
* Movie title storage
* Dynamic movie insertion
* Duplicate movie prevention

### ⭐ Rating System

* Users can rate movies they have watched.
* Ratings are associated with the logged-in user.
* One user cannot create duplicate ratings for the same movie.

### 🤖 Personalized Recommendation

The system:

1. Identifies the logged-in user.
2. Retrieves their rating history.
3. Identifies movies already watched.
4. Finds candidate unwatched movies.
5. Uses the recommendation model to predict preferences.
6. Sorts predictions.
7. Returns the highest-ranked movies.

---

# 🏗️ System Architecture

## High-Level Architecture

```text
                         ┌─────────────────────┐
                         │      FRONTEND       │
                         │                     │
                         │ Signup              │
                         │ Login               │
                         │ Movie Selection     │
                         │ Rating              │
                         │ Recommendations     │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / REST API
                                    ▼
                         ┌─────────────────────┐
                         │      FASTAPI        │
                         │      BACKEND        │
                         │                     │
                         │ Authentication      │
                         │ User Management     │
                         │ Movie Management    │
                         │ Rating Management   │
                         │ Recommendation API │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┴────────────────┐
                   │                                 │
                   ▼                                 ▼
        ┌────────────────────┐             ┌────────────────────┐
        │       MySQL        │             │ Recommendation     │
        │      Database      │             │      Engine        │
        │                    │             │                    │
        │ Users              │             │ Neural Network     │
        │ Movies             │             │ Embeddings         │
        │ Ratings            │             │ Prediction         │
        └────────────────────┘             └────────────────────┘
```

---

# 🔬 Low-Level Architecture

The backend is divided into logical components.

```text
Frontend
   │
   ▼
API Router
   │
   ├── Authentication Service
   │       ├── Signup
   │       └── Login
   │
   ├── User Service
   │       └── User Profile
   │
   ├── Movie Service
   │       ├── Search Movies
   │       └── Add Movie
   │
   ├── Rating Service
   │       ├── Add Rating
   │       └── Update Rating
   │
   └── Recommendation Service
           │
           ├── Fetch User Ratings
           ├── Find Unwatched Movies
           ├── Model Prediction
           ├── Ranking
           └── Return Recommendations
                    │
                    ▼
              MySQL Database
```

---

# 🔄 Complete Internal Flow

## 1. User Signup

```text
User
 ↓
Frontend Signup Form
 ↓
Email + Password
 ↓
FastAPI
 ↓
Validate Input
 ↓
Hash Password
 ↓
INSERT INTO users
 ↓
MySQL
 ↓
Generate Unique user_id
 ↓
Return Signup Response
```

Example:

```text
User
Email: user@gmail.com

Generated:

user_id = 10543
```

---

# 🔐 2. User Login

```text
User
 ↓
Login Form
 ↓
Email + Password
 ↓
FastAPI
 ↓
Find User
 ↓
Verify Password Hash
 ↓
Authentication Successful
 ↓
Create Authentication Session / Token
 ↓
Frontend receives authentication response
```

The user's identity is then available to protected endpoints.

---

# 🎬 3. Selecting Watched Movies

After signup/login:

```text
Frontend
 ↓
Request Movie List
 ↓
FastAPI
 ↓
MySQL
 ↓
movies table
 ↓
Return Movies
 ↓
Frontend displays movie selection
```

Example:

```text
☑ Interstellar
☑ Inception
☐ Titanic
☑ Avatar
```

---

# ⭐ 4. Rating Movies

The user provides ratings:

```text
Interstellar → 5
Inception    → 4
Avatar       → 3
```

Frontend sends:

```json
{
  "movie_id": 101,
  "rating": 5
}
```

Backend identifies the logged-in user.

Then:

```text
user_id = 10543
movie_id = 101
rating = 5
```

is stored in MySQL.

---

# 🗄️ Database Architecture

The system uses a relational database.

## Main Tables

```text
users
movies
ratings
```

Relationship:

```text
                ┌──────────────┐
                │    users     │
                │              │
                │ user_id PK   │
                │ email        │
                │ password     │
                └──────┬───────┘
                       │
                       │ 1:N
                       ▼
                ┌──────────────┐
                │   ratings    │
                │              │
                │ rating_id PK │
                │ user_id FK   │
                │ movie_id FK  │
                │ rating       │
                └──────┬───────┘
                       │
                       │ N:1
                       ▼
                ┌──────────────┐
                │    movies    │
                │              │
                │ movie_id PK  │
                │ title        │
                └──────────────┘
```

---

# 👤 Users Table

Stores website users.

```text
users
--------------------------------
user_id
name
email
password_hash
created_at
```

`user_id` uniquely identifies each website user.

---

# 🎥 Movies Table

Stores all movies available to the application.

```text
movies
--------------------------------
movie_id
title
created_at
```

The movie catalog initially comes from the movie dataset.

New movies can later be added through the application.

---

# ⭐ Ratings Table

Stores user-movie interactions.

```text
ratings
--------------------------------
rating_id
user_id
movie_id
rating
```

Example:

```text
rating_id | user_id | movie_id | rating
----------------------------------------
1         | 10      | 101      | 5.0
2         | 10      | 205      | 4.0
3         | 15      | 101      | 4.5
```

The constraint:

```sql
UNIQUE(user_id, movie_id)
```

ensures that one user cannot create multiple ratings for the same movie.

---

# 🤖 Machine Learning Architecture

The recommendation engine uses **collaborative filtering with neural-network embeddings**.

Conceptually:

```text
User ID
   ↓
User Embedding
   ↓
        ┐
        ├── Neural Network
        │
Movie ID
   ↓
Movie Embedding
   ↓
Predicted Rating
```

The model learns representations for users and movies.

The goal is:

```text
(User, Movie) → Predicted Rating
```

Example:

```text
User 10543 + Movie 101
       ↓
Model
       ↓
Predicted Rating = 4.72
```

---

# 🧠 Recommendation Flow

When the user clicks:

```text
🎯 Recommend Movies
```

the following process occurs:

```text
1. Identify logged-in user
          ↓
2. Fetch user's ratings
          ↓
3. Find watched movie IDs
          ↓
4. Fetch available movies
          ↓
5. Remove already watched movies
          ↓
6. Generate candidate movie list
          ↓
7. Send User ID + Candidate Movie IDs
          ↓
8. Neural Recommendation Model
          ↓
9. Predict ratings
          ↓
10. Sort predictions descending
          ↓
11. Select Top-N movies
          ↓
12. Return recommendations
          ↓
13. Display on frontend
```

Example:

```text
Movie              Predicted Rating
------------------------------------
The Matrix              4.91
Interstellar             4.84
The Prestige             4.79
Gladiator                4.71
Arrival                  4.63
```

---

# 🚫 Preventing Already Watched Movies

Suppose the user has watched:

```text
101
205
309
```

The backend obtains:

```sql
SELECT movie_id
FROM ratings
WHERE user_id = 10543;
```

The recommendation system then excludes:

```text
101
205
309
```

from candidate movies.

Therefore:

```text
Candidate Movies
       ↓
Remove Watched Movies
       ↓
Unwatched Movies
       ↓
ML Prediction
```

---

# 🆕 New Movie Handling

The application can handle a movie that does not currently exist in the database.

Flow:

```text
User enters movie title
          ↓
Search movies table
          ↓
Does movie exist?
       /       \
     YES        NO
      │          │
      │          ▼
      │     Generate movie_id
      │          │
      │          ▼
      │     Insert new movie
      │          │
      └──────────┘
             ↓
       Store rating
```

Example:

```text
User enters:

"The New Movie"

Database search:
Movie doesn't exist

        ↓

Create:

movie_id = 12001
title = "The New Movie"
```

Then the user's rating is stored.

### Important ML consideration

Adding a movie to MySQL does not automatically make the existing trained neural network understand that new movie.

The model must eventually be updated/retrained or the system must use a strategy for handling unseen movies.

This is handled separately from database insertion.

---

# 📊 Dataset Integration

The project uses two datasets.

## User/Ratings Dataset

```text
user_id
movie_id
rating
```

This data is imported primarily into:

```text
ratings
```

while preserving the IDs required by the trained model.

## Movie Dataset

```text
movie_id
title
```

This data is imported into:

```text
movies
```

The original IDs should remain consistent with the model's learned movie representations.

---

# 🔗 Model ↔ Database Relationship

The database and ML model have different responsibilities.

```text
                 DATABASE
                    │
        ┌───────────┴───────────┐
        │                       │
   User Data                Movie Data
        │                       │
        └───────────┬───────────┘
                    │
                 Ratings
                    │
                    ▼
          Recommendation Engine
                    │
                    ▼
           Predicted Ratings
                    │
                    ▼
              Top-N Movies
```

### Database

Responsible for:

* Persistent storage
* Users
* Movies
* Ratings
* Authentication data
* Application state

### ML Model

Responsible for:

* Learning user/movie relationships
* Predicting ratings
* Ranking candidate movies

---

# 🌐 API Architecture

The FastAPI backend will expose REST APIs.

Example endpoints:

## Authentication

```text
POST /auth/signup
POST /auth/login
```

## Movies

```text
GET /movies
GET /movies/{movie_id}
POST /movies
```

## Ratings

```text
POST /ratings
PUT /ratings/{movie_id}
GET /ratings/user/{user_id}
```

## Recommendations

```text
GET /recommendations
```

The exact API structure can evolve during implementation.

---

# 🖥️ Frontend Architecture

The frontend provides the user interface.

Main pages:

```text
Signup
   ↓
Login
   ↓
Home
   ↓
Movie Selection
   ↓
Rating
   ↓
Recommendation Dashboard
```

Recommendation cards can display:

```text
┌──────────────────────────┐
│ 🎬 Interstellar          │
│                          │
│ Predicted Rating: 4.84   │
│                          │
│       [View Movie]       │
└──────────────────────────┘
```

---

# 🧰 Technology Stack

## Machine Learning

* Python
* NumPy
* Pandas
* TensorFlow / Keras
* Scikit-learn

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy / MySQL Connector

## Database

* MySQL
* MySQL Workbench

## Frontend

* React
* Vite
* HTML
* CSS
* JavaScript / TypeScript

## Development

* Git
* GitHub
* VS Code
* Jupyter Notebook

## Deployment

Potential deployment architecture:

```text
Frontend → Vercel
Backend  → Render / Azure
Database → Cloud MySQL
Model    → Backend Service
```

---

# 📁 Proposed Project Structure

```text
movie-recommendation-system/
│
├── backend/
│   │
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── database/
│   │   │   ├── connection.py
│   │   │   └── models.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── movies.py
│   │   │   ├── ratings.py
│   │   │   └── recommendations.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── movie_service.py
│   │   │   ├── rating_service.py
│   │   │   └── recommendation_service.py
│   │   │
│   │   └── ml/
│   │       ├── model.py
│   │       ├── predict.py
│   │       └── model.keras
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   ├── movies.csv
│   └── ratings.csv
│
├── notebooks/
│   └── movie_recommendation.ipynb
│
├── scripts/
│   └── import_data.py
│
├── .gitignore
└── README.md
```

---

# 🔄 End-to-End Data Flow

```text
                    USER
                     │
                     ▼
              ┌─────────────┐
              │  FRONTEND   │
              └──────┬──────┘
                     │
                     │ REST API
                     ▼
              ┌─────────────┐
              │   FASTAPI   │
              └──────┬──────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
      ┌─────────┐          ┌────────────┐
      │  MySQL  │          │ ML MODEL   │
      └────┬────┘          └─────┬──────┘
           │                     │
           │ User Ratings        │ Predictions
           │                     │
           └──────────┬──────────┘
                      ▼
               Recommendation
                      │
                      ▼
                 Top-N Movies
                      │
                      ▼
                  FRONTEND
```

---

# 🔐 Security

The application should follow basic production security practices.

### Password Security

Passwords must **never be stored as plain text**.

Instead:

```text
User Password
      ↓
Password Hashing
      ↓
password_hash
      ↓
MySQL
```

### Environment Variables

Sensitive credentials should be stored in environment variables:

```text
DATABASE_URL
MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
SECRET_KEY
```

They should not be committed to GitHub.

---

# ❄️ Cold Start Problem

A new user has no rating history.

Therefore:

```text
New User
   ↓
No Ratings
   ↓
No Learned Preferences
```

To solve this, the application can ask a new user to select/rate several movies during onboarding.

Example:

```text
Select movies you have watched:

☑ Interstellar     5
☑ Inception        5
☑ Avatar           3
☑ Titanic          2
☑ The Matrix       5
```

These initial ratings provide preference information.

This is called the **cold-start problem**.

---

# 🧠 Important ML Limitation

The existing neural-network model was trained using a fixed set of users and movies.

Therefore, a completely new:

```text
user_id
```

or:

```text
movie_id
```

may not automatically exist inside the trained embedding matrices.

The production system must therefore handle:

```text
New Users
New Movies
```

through an appropriate strategy such as:

* Retraining
* Incremental model updates
* Pretrained embeddings + new embeddings
* Hybrid recommendation
* Content-based fallback
* Popularity-based fallback

This will be implemented as part of the production recommendation pipeline.

---

# 📈 Future Improvements

The system can later be extended with:

### Recommendation Improvements

* Hybrid recommendation
* Content-based filtering
* Genre-based recommendations
* Popularity fallback
* Personalized ranking
* Similar movie recommendations

### ML Improvements

* Model retraining pipeline
* New-user embedding strategy
* New-movie embedding strategy
* Evaluation metrics
* Precision@K
* Recall@K
* NDCG@K

### Application Improvements

* Movie posters
* Movie descriptions
* Search
* Filtering
* Genre browsing
* Recommendation explanations
* User watch history
* Favorites
* Watchlist

### Infrastructure

* Docker
* Cloud deployment
* Redis caching
* Background model retraining
* Monitoring
* Logging

---

# ☁️ Deployment Architecture

A production deployment can follow:

```text
                    INTERNET
                       │
                       ▼
                ┌──────────────┐
                │   Frontend   │
                │   Vercel     │
                └──────┬───────┘
                       │
                       │ HTTPS
                       ▼
                ┌──────────────┐
                │   FastAPI    │
                │ Render/Azure │
                └──────┬───────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
       ┌────────────┐    ┌──────────────┐
       │   MySQL    │    │ ML Model     │
       │ Cloud DB   │    │ Recommendation│
       └────────────┘    └──────────────┘
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <repository-url>

cd movie-recommendation-system
```

## 2. Create Python environment

```bash
python -m venv venv
```

Activate it:

### Linux / macOS

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

## 3. Install backend dependencies

```bash
pip install -r backend/requirements.txt
```

## 4. Configure environment variables

Create:

```text
.env
```

Example:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=movie_recommendation_db
SECRET_KEY=your_secret_key
```

## 5. Start FastAPI

```bash
uvicorn backend.app.main:app --reload
```

---

# ▶️ Usage

### Step 1

Create an account.

### Step 2

Login.

### Step 3

Select movies you have watched.

### Step 4

Give ratings.

### Step 5

Click:

```text
🎯 Get Recommendations
```

### Step 6

The system predicts the user's preferences and returns the highest-ranked unwatched movies.

---

# 🧪 Example

Suppose the user has rated:

```text
Interstellar → 5
Inception    → 5
Avatar       → 3
Titanic      → 2
```

The recommendation engine might generate:

```text
Movie              Predicted Score
-----------------------------------
The Matrix             4.91
The Prestige           4.87
Arrival                4.81
Gladiator              4.73
```

The system recommends these movies because their predicted preference scores are higher.

---

# 🎯 Project Goal

This project aims to demonstrate how a machine-learning recommendation model can be transformed into a **complete real-world software system**.

Instead of keeping the recommendation model isolated inside a Jupyter Notebook, the project integrates:

```text
Machine Learning
       +
Database
       +
Backend API
       +
Authentication
       +
Frontend
       +
Real-Time User Interaction
```

creating a complete personalized movie recommendation platform.

---

# 👨‍💻 Development Philosophy

The project follows a separation-of-concerns architecture:

```text
Frontend
    ↓
Handles user interaction

Backend
    ↓
Handles business logic and APIs

Database
    ↓
Handles persistent application data

ML Engine
    ↓
Handles recommendation intelligence
```

Each component has a clear responsibility, making the system easier to maintain, test, scale, and improve.

---

# 📌 Final Architecture Summary

```text
                         MOVIE RECOMMENDATION SYSTEM

                                  USER
                                   │
                                   ▼
                           ┌───────────────┐
                           │    FRONTEND   │
                           └───────┬───────┘
                                   │
                              REST API
                                   │
                                   ▼
                           ┌───────────────┐
                           │    FASTAPI    │
                           │    BACKEND    │
                           └───────┬───────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
          Authentication       MySQL DB         ML Engine
                                  │                  │
                          ┌───────┼───────┐          │
                          │       │       │          │
                        Users   Movies  Ratings      │
                          │       │       │          │
                          └───────┴───────┘          │
                                  │                  │
                                  └────────┬─────────┘
                                           ▼
                                  Personalized Ranking
                                           │
                                           ▼
                                    Top-N Movies
                                           │
                                           ▼
                                       FRONTEND
```

---

## 🚀 Future Vision

The ultimate goal is to evolve the project from a simple ML demonstration into a scalable recommendation platform capable of continuously learning from user interactions and delivering increasingly personalized movie recommendations.

**Built with Python • TensorFlow • FastAPI • MySQL • React**
