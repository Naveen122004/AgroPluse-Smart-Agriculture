# REST API Documentation – AgroPulse

**Base URL:** `http://localhost:8080/api`  
**Authentication:** Bearer JWT in `Authorization` header  
**Content-Type:** `application/json`

---

## Standard Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "timestamp": "2026-06-12T10:00:00"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": ["Email is required"],
  "timestamp": "2026-06-12T10:00:00"
}
```

---

## 1. Authentication APIs

### POST /auth/signup

Register a new farmer account.

**Request Body:**
```json
{
  "fullName": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phone": "9876543210",
  "password": "Farmer@123",
  "confirmPassword": "Farmer@123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "fullName": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "phone": "9876543210"
    }
  }
}
```

### POST /auth/login

**Request Body:**
```json
{
  "email": "ramesh@example.com",
  "password": "Farmer@123",
  "rememberMe": true
}
```

**Response (200):** Same as signup response with JWT token.

### POST /auth/forgot-password

**Request Body:**
```json
{
  "email": "ramesh@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### POST /auth/verify-otp

**Request Body:**
```json
{
  "email": "ramesh@example.com",
  "otp": "482910"
}
```

### POST /auth/reset-password

**Request Body:**
```json
{
  "email": "ramesh@example.com",
  "otp": "482910",
  "newPassword": "NewPass@456",
  "confirmPassword": "NewPass@456"
}
```

---

## 2. Profile APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /profile | Yes | Get current user profile |
| PUT | /profile | Yes | Update profile |
| POST | /profile/photo | Yes | Upload profile photo (multipart) |
| PUT | /profile/change-password | Yes | Change password |

### PUT /profile

**Request Body:**
```json
{
  "fullName": "Ramesh Kumar",
  "phone": "9876543210",
  "address": "Village Rampur, Tehsil Meerut",
  "state": "Uttar Pradesh",
  "district": "Meerut",
  "preferredCrop": "Wheat",
  "farmSize": 5.5
}
```

---

## 3. Weather APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /weather/current?city={city} | Yes | Current weather by city |
| GET | /weather/forecast?city={city} | Yes | 7-day forecast |
| GET | /weather/location?lat={lat}&lon={lon} | Yes | Weather by coordinates |
| GET | /weather/history | Yes | User search history |

### GET /weather/current?city=Delhi

**Response:**
```json
{
  "data": {
    "city": "Delhi",
    "country": "IN",
    "temperature": 34.5,
    "feelsLike": 38.2,
    "humidity": 65,
    "windSpeed": 12.5,
    "pressure": 1012,
    "visibility": 10000,
    "rainProbability": 20,
    "condition": "Partly Cloudy",
    "icon": "02d",
    "sunrise": "05:23 AM",
    "sunset": "07:15 PM"
  }
}
```

---

## 4. Market Price APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /market/prices | Yes | List all prices (paginated) |
| GET | /market/prices/search?crop={crop} | Yes | Search by crop |
| GET | /market/prices/filter?state={s}&district={d} | Yes | Filter prices |
| GET | /market/prices/trends?crop={crop} | Yes | Price trend data |
| GET | /market/prices/weekly?crop={crop} | Yes | Weekly comparison |

**Query Parameters:**
- `page` (default: 0), `size` (default: 20)
- `sortBy` (avgPrice, minPrice, maxPrice, cropName)
- `sortDir` (asc, desc)

---

## 5. Irrigation APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /irrigation/recommend | Yes | Get recommendation |
| GET | /irrigation/history | Yes | User irrigation history |

### POST /irrigation/recommend

**Request Body:**
```json
{
  "cropType": "Rice",
  "soilType": "Clay",
  "weatherCondition": "Rain Forecast"
}
```

**Response:**
```json
{
  "data": {
    "waterRequirement": "Moderate",
    "recommendedTime": "Early Morning (5-7 AM)",
    "irrigationFrequency": "Every 4 days",
    "recommendation": "Delay irrigation for 2 days due to expected rainfall."
  }
}
```

---

## 6. Crop Care APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /crop-care | Yes | List all advisories |
| GET | /crop-care/search?q={query} | Yes | Search advisories |
| GET | /crop-care/filter?crop={c}&category={cat} | Yes | Filter advisories |
| GET | /crop-care/{id} | Yes | Get advisory details |
| GET | /crop-care/tip-of-day | Yes | Daily crop tip |

---

## 7. Disease Alert APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /diseases | Yes | List active disease alerts |
| GET | /diseases/search?q={query} | Yes | Search diseases |
| GET | /diseases/filter?crop={c}&category={cat} | Yes | Filter diseases |
| GET | /diseases/{id} | Yes | Disease details |

---

## 8. Government Scheme APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /schemes | Yes | List schemes |
| GET | /schemes/search?q={query} | Yes | Search schemes |
| GET | /schemes/filter?state={state} | Yes | Filter by state |
| GET | /schemes/{id} | Yes | Scheme details |
| POST | /schemes/{id}/save | Yes | Bookmark scheme |
| DELETE | /schemes/{id}/save | Yes | Remove bookmark |
| GET | /schemes/saved | Yes | User's saved schemes |

---

## 9. Chatbot APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /chatbot/message | Yes | Send message to bot |
| GET | /chatbot/history | Yes | Chat history |
| GET | /chatbot/suggestions | Yes | Suggested questions |

### POST /chatbot/message

**Request Body:**
```json
{
  "message": "What is the weather in Pune?"
}
```

**Response:**
```json
{
  "data": {
    "reply": "The current weather in Pune is 28°C with partly cloudy skies.",
    "suggestions": ["Crop tips for wheat", "Latest market prices"]
  }
}
```

---

## 10. Notification APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /notifications | Yes | List notifications |
| GET | /notifications/unread-count | Yes | Unread count |
| PUT | /notifications/{id}/read | Yes | Mark as read |
| PUT | /notifications/read-all | Yes | Mark all as read |

---

## 11. Dashboard APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /dashboard/summary | Yes | Aggregated dashboard data |
| GET | /dashboard/activities | Yes | Recent activities |

---

## 12. Utility APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /search?q={query} | Yes | Global search |
| POST | /contact | No | Landing page contact form |
| GET | /health | No | Health check |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

*AgroPulse API Documentation v1.0*
