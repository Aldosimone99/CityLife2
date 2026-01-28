# Backend

This project provides functionality for user registration and authentication, the creation of posts and comments, and the modification of personal data. The backend API supports various operations via specific controllers.

## Technologies Used

- **Java**: Primary programming language.
- **Spring Framework**: Used for dependency management, configuration, and REST API development.
- **Spring Boot**: Simplifies project configuration and startup.
- **Hibernate**: Handles data persistence.
- **PostgreSQL**: Database used for data storage.
- **Spring Security**: Manages security and authentication.

# Controllers

- **CommentController**: Manages operations related to comments, including:
  - Creating new comments associated with a specific post.
  - Retrieving all comments for a post or a single comment by ID.
  - Editing an existing comment.
  - Deleting a specific comment.
- **PostController**: Manages operations related to posts, including:
  - Creating new posts associated with the authenticated user.
  - Retrieving all posts or a single post by ID.
  - Deleting a specific post.
  - Handling errors for invalid input or incorrect IDs.
- **UserController**: Manages operations related to users, including:
  - Registering new users, checking for email or username availability.
  - User login and JWT token generation.
  - Retrieving the authenticated user’s details.
  - Updating the authenticated user’s personal data.
  - Retrieving posts associated with a specific user.
  - Deleting a specific user.

## CommentController

- **Endpoint**: `/api/posts/{postId}/comments`  
  **Method**: POST  
  **Description**: Creates a new comment associated with a specific post.  
  **Request Body**: `Comment` (comment details).  
  **Responses**:  
  - **200 OK**: Returns the created comment.  
  - **400 Bad Request**: Returns error details for invalid input.  
  - **500 Internal Server Error**: Returns a server error message.  

- **Endpoint**: `/api/posts/{postId}/comments`  
  **Method**: GET  
  **Description**: Retrieves all comments associated with a specific post.  
  **Responses**:  
  - **200 OK**: Returns a list of comments.  

- **Endpoint**: `/api/posts/{postId}/comments/{commentId}`  
  **Method**: DELETE  
  **Description**: Deletes a specific comment.  
  **Responses**:  
  - **204 No Content**: Confirms deletion.  
  - **404 Not Found**: Comment not found.  

## PostController

- **Endpoint**: `/api/posts`  
  **Method**: POST  
  **Description**: Creates a new post associated with the authenticated user.  
  **Request Body**: `Post` (post details).  
  **Responses**:  
  - **201 Created**: Returns the created post.  
  - **400 Bad Request**: Returns error details for invalid input.  

- **Endpoint**: `/api/posts/{id}`  
  **Method**: GET  
  **Description**: Retrieves a specific post by ID.  
  **Responses**:  
  - **200 OK**: Returns the requested post.  
  - **404 Not Found**: Post not found.  

- **Endpoint**: `/api/posts/{id}`  
  **Method**: DELETE  
  **Description**: Deletes a specific post.  
  **Responses**:  
  - **204 No Content**: Confirms deletion.  
  - **400 Bad Request**: Invalid ID.  

## UserController

- **Endpoint**: `/api/users/login`  
  **Method**: POST  
  **Description**: Logs in a user and generates a JWT token.  
  **Request Body**: `LoginRequest` (email and password).  
  **Responses**:  
  - **200 OK**: Returns the JWT token and user ID.  
  - **500 Internal Server Error**: Returns a server error message.  

- **Endpoint**: `/api/users/me`  
  **Method**: GET  
  **Description**: Retrieves the authenticated user’s details.  
  **Request Header**: `Authorization` (JWT token).  
  **Responses**:  
  - **200 OK**: Returns user details.  
  - **404 Not Found**: User not found.  

- **Endpoint**: `/api/users/me`  
  **Method**: PUT  
  **Description**: Updates the authenticated user’s details.  
  **Request Body**: `User` (updated details).  
  **Responses**:  
  - **200 OK**: Confirms the update.  
  - **404 Not Found**: User not found.  

- **Endpoint**: `/api/users/{id}/posts`  
  **Method**: GET  
  **Description**: Retrieves posts associated with a specific user.  
  **Responses**:  
  - **200 OK**: Returns a list of posts.  
  - **404 Not Found**: User not found.  

# Security

Project security is managed via **Spring Security** and **JWT (JSON Web Token)**. Below are the main security aspects implemented:

- **Authentication**:
  - Users authenticate by providing email and password via the `/api/users/login` endpoint.
  - After successful authentication, a JWT token is generated and returned to the client.
  - The JWT token must be included in the `Authorization` header of subsequent requests with the `Bearer` prefix.

- **Authorization**:
  - Protected endpoints require a valid JWT token to access resources.
  - The `JwtRequestFilter` intercepts requests, validates the JWT token, and sets the security context for the authenticated user.

- **Resource Protection**:
  - Only authenticated users can access or modify their own resources (e.g., profile details or posts).
  - Sensitive operations, such as modifying or deleting data, are protected by authorization checks based on user identity.

- **Error Handling**:
  - Requests with an invalid or missing JWT token return an HTTP 403 (Forbidden).
  - Authentication and authorization errors are handled centrally to ensure consistent responses.

This configuration ensures that only authorized users can access resources and that sensitive data is protected.

## How to Run the Project

1. Make sure you have installed:
   - **Java 17** or higher.
   - **Maven** for dependency management.

2. Clone the repository:
   ```bash
   git clone https://github.com/aldosimone99/CityLife2.git
   cd CityLife2/backend
   ```

3. Initialize the database via Docker:
   ```bash
   docker-compose up
   ```

4. Start the application:
   ```bash
   mvn spring-boot:run
   ```

