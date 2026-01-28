# CityLife2 — Full-Stack Social Web App (Angular + Spring Boot)

CityLife2 is a **full-stack web application** built with **Angular** for the frontend and **Spring Boot (Java)** for the backend.

The project follows a **social network** concept: users can register, log in, create posts, and comment while interacting with other users.  
This repository is organized as a real-world **client–server architecture**, where the frontend communicates with the backend through **REST APIs**.

---

## Project Structure

### Frontend

The `frontend` section contains the UI code built with **Angular**.  
For setup and run instructions, see:  
- [`frontend/README.md`](./frontend/README.md)

### Backend

The `backend` section contains the server-side code built with **Spring Boot (Java)**, including API and security.  
For setup and run instructions, see:  
- [`backend/README.md`](./backend/README.md)

---

## Features

- **Registration & Login**  
  Users can create an account and authenticate into the application.

- **Posts**  
  Users can create and delete posts.

- **Comments**  
  Users can create and delete comments on posts.

- **Profile Management**  
  Authenticated users can view and update their profile.

- **Browse Other Profiles**  
  Authenticated users can view other users’ profiles.

- **Multilanguage (i18n)**  
  Language toggle between **Italian** and **English**.

- **Security**  
  Authentication and authorization implemented with **Spring Security**.

---

## Tech Stack

- **Frontend:** Angular (TypeScript), HTML, CSS  
- **Backend:** Spring Boot (Java), Spring Security  
- **API:** RESTful APIs  
- **Database:** PostgreSQL  
- **Tooling:** Docker Compose (database), Maven (backend build)

---

## Prerequisites

Before running the application, make sure you have:

- **Node.js** (for Angular)
- **Angular CLI**
- **Java 17+** (for Spring Boot)
- **Docker + Docker Compose** (to start PostgreSQL)
- **Maven** (to build the backend)

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Aldosimone99/CityLife2.git

### Backend (Spring Boot)

1. Make sure Docker is installed and running. Start PostgreSQL via Docker Compose:
   ```bash
   docker-compose up
   ```

2. Go to the backend directory:
   ```bash
   cd backend
   ```
3. Build the project using Maven:
   ```bash
   mvn clean install
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend (Angular)

1. Go to the frontend directory:
   ```bash
   cd frontend
   ```

2. (Optional) Install Angular CLI globally:
   ```bash
   npm install -g @angular/cli
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Angular development server:
   ```bash
   ng serve
   ```
5. Open your browser and go to `http://localhost:4200`.

## Folder Structure

- **/backend**: Contains the Spring Boot application.
- **/frontend**: Contains the Angular application.

