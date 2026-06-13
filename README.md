# AgroPulse – Smart Agriculture Support System

**Tagline:** Empowering Farmers Through Smart Technology

A full-stack final-year project for farmers — weather forecasts, market prices, irrigation scheduling, crop care, disease alerts, government schemes, and an AI chatbot.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Bootstrap 5, Chart.js, Axios, Context API |
| Backend | Java 17+, Spring Boot 3.2, Spring Security, JWT, JPA |
| Database | MySQL 8 |
| APIs | OpenWeatherMap, Dialogflow (optional), Market data (seeded) |

## Project Structure

```
FramSync-Project/
├── docs/           # SRS, Architecture, ER, API docs, wireframes
├── database/       # MySQL schema SQL
├── backend/        # Spring Boot REST API
└── frontend/       # React SPA
```

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- Node.js 18+
- MySQL 8.x

## Database Setup

```sql
-- Run the schema script
mysql -u root -p < database/schema.sql
```

Or let Spring Boot auto-create tables (`spring.jpa.hibernate.ddl-auto=update`).

Update credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

## Backend Setup

```bash
cd backend

# Option A: MySQL (update password in application.properties first)
mvn spring-boot:run

# Option B: H2 in-memory (no MySQL setup needed — good for demo)
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

API base URL: `http://localhost:8080/api`

### Optional Environment Variables

```bash
OPENWEATHER_API_KEY=your_key    # Live weather data
MAIL_USERNAME=your@gmail.com    # OTP emails
MAIL_PASSWORD=app_password
DIALOGFLOW_PROJECT_ID=project   # Chatbot NLP
```

Without API keys, the system uses fallback/mock data for weather and keyword-based chatbot responses.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App URL: `http://localhost:5173`

## Default Demo Flow

1. Open `http://localhost:5173`
2. Sign up with a new account
3. Complete your profile (state, district, preferred crop)
4. Explore Dashboard and all modules

## Modules

| # | Module | Route |
|---|--------|-------|
| 1 | Authentication | `/login`, `/signup`, `/forgot-password` |
| 2 | Profile | `/profile` |
| 3 | Landing Page | `/` |
| 4 | Dashboard | `/dashboard` |
| 5 | Weather | `/weather` |
| 6 | Market Prices | `/market` |
| 7 | Irrigation | `/irrigation` |
| 8 | Crop Care | `/crop-care` |
| 9 | Disease Alerts | `/diseases` |
| 10 | Govt Schemes | `/schemes` |
| 11 | Chatbot | `/chatbot` |
| 12 | Notifications | `/notifications` |

## Documentation

See the `docs/` folder for:

- [SRS](docs/SRS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [UI Wireframes](docs/UI_WIREFRAMES.md)
- [UML Diagrams](docs/DIAGRAMS.md)
- [Project Roadmap](docs/ROADMAP.md)

## Security

- JWT authentication with BCrypt password hashing
- API keys stored server-side only
- CORS restricted to frontend origin
- Input validation on all endpoints

---

© 2026 AgroPulse – Final Year Project
