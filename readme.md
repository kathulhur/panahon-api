# Weather API

This is a simple weather API implemented using Node.js, Express, and TypeScript. It provides weather information for different cities and includes authentication functionality.


## API Endpoints

### Authentication

- `POST /api/auth/register`: Creates a new user.

Request body:
 ```json
 {
    "name": "exampleuser",
    "email": "exampleuser@mail.com",
    "password": "password123"
 }
 ```
Response:
 ```json
 {
    "message": "Registration successful",
    "status": 200,
    "data": {
        "name": "exampleuser",
        "email": "exampleuser@mail.com"
    }
}
 ```

- `POST /api/auth/login`: Authenticates a user and returns user info and a JWT token.

Request body:
 ```json
 {
    "email": "exampleuser@mail.com",
    "password": "password123"
 }
 ```
Response:
 ```json
{
  "message": "User logged in successfully",
  "status": 200,
  "data": {
      "name": "exampleuser",
      "email": "exampleuser@mail.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIzQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkSnUxeEouL2RwdXY4RXB1QlZjbll3ZXZ6R1Q3VTNRNGR0RVd1MHJ2dGo2Lm9rWlNLd3N6aC4iLCJpYXQiOjE2ODUzNDg1MTcsImV4cCI6MTY4NTM1MjExN30.i9flYxQtPreviCxg_mAaHFAK0Env4MFT2MGyo-TgAVA"
  }
}
 ```

### Weather Information

- `GET /api/weather/:city`: Retrieves weather information for a specific city.

Response:
 ```json
{
  "data": {
      "location": {
          "name": "Manila",
          "region": "Manila",
          "country": "Philippines",
          "localtime": "2023-05-29 16:19"
      },
      "current": {
          "temp_c": 32,
          "condition": {
              "text": "Partly cloudy",
              "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
          }
      }
  },
  "message": "OK",
  "status": 200
}
 ```

### User Management (Protected Routes)

The following routes require authentication and admin privileges.

- `GET /api/users`: Retrieves all users (only accessible to admin users).

- `POST /api/users`: Creates a new user (only accessible to admin users).


- `PUT /api/users/:id`: Updates user information (only accessible to admin users).


- `DELETE /api/users/:id`: Deletes a user (only accessible to admin users).


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