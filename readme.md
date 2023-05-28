# Weather Information API

Welcome to the Weather Information API!

## API Endpoint

The API provides weather information for a given city.

**Endpoint:**

GET /api/weather/:city


**Parameters:**

- `:city` - The name of the city for which you want to retrieve weather information.

**Example Usage:**

GET /api/weather/london


**Example Response:**

```json
{
    "data": {
        "location": {
            "name": "Manila",
            "region": "Manila",
            "country": "Philippines",
            "localtime": "2023-05-29 0:56"
        },
        "current": {
            "temp_c": 30,
            "condition": {
                "text": "Partly cloudy",
                "icon": "//cdn.weatherapi.com/weather/64x64/night/116.png"
            }
        }
    },
    "message": "OK",
    "status": 200
  }
```

Please note that the weather information provided is subject to change and may not reflect real-time conditions.


## Getting Started
 
To get started with the Weather Information API, follow these steps:

1. Clone the repository: git clone https://github.com/your-username/your-repo.git
2. Install the dependencies: npm install
3. Start the server: npm start
4. Make requests to the API endpoint: http://localhost:3000/api/weather/:city

### Customization

Feel free to customize the API according to your needs. You can add additional features, integrate with different weather providers, or enhance error handling. Remember to update the documentation accordingly if you make any changes.

### Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create a new issue or submit a pull request.

### License
This project is licensed under the MIT License.