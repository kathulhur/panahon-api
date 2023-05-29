# Weather API

This is a simple weather API implemented using Node.js, Express, and TypeScript. It provides weather information for different cities and includes authentication functionality.

## API Endpoints

### Authentication

- `POST /api/auth/register`: Creates a new user.
- `POST /api/auth/login`: Authenticates a user and returns user info and a JWT token.

### Weather Information

- `GET /api/weather/:city`: Retrieves weather information for a specific city.

### User Management (Protected Routes)

The following routes require authentication.

- `GET /api/users`: Retrieves all users (only accessible to authenticated users).
- `POST /api/users`: Creates a new user (only accessible to authenticated users).
- `PUT /api/users/:id`: Updates user information (only accessible to authenticated users).
- `DELETE /api/users/:id`: Deletes a user (only accessible to authenticated users).


## Getting Started

1. Clone the repository:
git clone https://github.com/your-username/your-repo.git

2. Install dependencies:
npm install


3. Set up environment variables:
- Create a `.env` file in the root directory.
- Define the following variables in the `.env` file:
  ```
  PORT=3000
  DATABASE_URL=your-database-connection-string
  JWT_SECRET=your-jwt-secret
  ```

4. Run the application:
npm start


The API server will start running on http://localhost:3000.


Feel free to explore and modify the code structure according to your needs. If you have any questions or need further assistance, please don't hesitate to ask!