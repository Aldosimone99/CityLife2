# Frontend

## Main Features

- **User Registration**  
  Through the `/register` page, users can sign up by providing their personal information.

- **Login**  
  Allows users to authenticate using email and password.

- **Dashboard**  
  The dashboard is displayed after login.  
  It shows a welcome message with the user’s first and last name and displays posts created by other users.

- **Navbar**  
  Allows navigation across the application and enables language selection (Italian or English).

- **Post Creation**  
  Users can create new posts, which can later be deleted by the author.

- **Comments Creation**  
  Users can add comments to posts and delete their own comments.

- **Personal Profile**  
  Through the `/profile` page, users can:
  - View their own posts  
  - Create new posts  
  - Update personal information  

- **Users Page**  
  The `/users` page displays a list of all registered users and provides access to their profiles.

- **User Profiles**  
  Each user profile shows personal information and published posts.

- **Responsive UI**  
  Optimized for both desktop and mobile devices.

- **API Integration**  
  Communicates with the backend to fetch and update data in real time.

---

## Requirements

- **Node.js**: Version 14 or higher  
- **Angular CLI**: Version 12 or higher  
- **Modern browser**: Chrome, Firefox, Edge  

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aldosimone99/CityLife2.git
   cd CityLife2/frontend
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Start the application in development mode**  
   ```bash
   ng serve
   ```

4. **Open the browser**  
   Visit [http://localhost:4200](http://localhost:4200).

---

## Project Structure

- **`src/app`**  
  Contains the main Angular components, services, and modules.

- **`src/assets`**  
  Includes static resources such as images and stylesheets.

## Purpose of the Frontend

 	•	Component-based UI development with Angular
	•	Integration with a secure backend API
	•	Real-world user flows (authentication, profiles, posts, comments)
	•	Responsive and user-focused interface design