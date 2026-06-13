# Software Requirement Specification (SRS)

## AgroPulse – Smart Agriculture Support System

**Version:** 1.0  
**Date:** June 2026  
**Prepared By:** Final Year Project Team  
**Institution:** BCA / BE / BTech – Computer Science  

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements for **AgroPulse**, a web-based smart agriculture support platform designed to help farmers make informed decisions about weather, irrigation, crop care, market prices, disease prevention, and government schemes.

### 1.2 Scope

AgroPulse is a full-stack web application comprising:

- **Frontend:** React.js single-page application with responsive UI
- **Backend:** Java Spring Boot REST API with JWT authentication
- **Database:** MySQL relational database
- **External Integrations:** OpenWeatherMap, Government Market Price API, Google Dialogflow

The system serves a single user role: **Farmer/User**.

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| SRS | Software Requirement Specification |
| JWT | JSON Web Token |
| REST | Representational State Transfer |
| OTP | One-Time Password |
| API | Application Programming Interface |
| BCrypt | Password hashing algorithm |

### 1.4 References

- OpenWeatherMap API Documentation
- data.gov.in / Agmarknet Market Price APIs
- Google Dialogflow ES Documentation
- Spring Boot 3.x Documentation
- React 18 Documentation

### 1.5 Overview

This SRS is organized into: overall description, functional requirements, non-functional requirements, system interfaces, and constraints.

---

## 2. Overall Description

### 2.1 Product Perspective

AgroPulse is a standalone web application that integrates third-party weather and market data services through a secure backend proxy. Farmers access the platform via modern browsers on desktop, tablet, or mobile devices.

```
┌─────────────┐     HTTPS      ┌──────────────┐     JDBC      ┌─────────┐
│   React     │ ◄────────────► │ Spring Boot  │ ◄───────────► │  MySQL  │
│  Frontend   │                │   Backend    │               │   DB    │
└─────────────┘                └──────┬───────┘               └─────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            OpenWeatherMap    Market Price API    Dialogflow API
```

### 2.2 Product Functions

1. User registration, login, and password recovery
2. Profile management with photo upload
3. Real-time and forecast weather information
4. Crop market price monitoring and analytics
5. Irrigation scheduling recommendations
6. Crop care advisory content
7. Disease alert notifications
8. Government scheme information and bookmarking
9. AI-powered chatbot assistance
10. In-app notification system
11. Dashboard with aggregated insights
12. Dark mode, PDF export, and activity tracking

### 2.3 User Characteristics

| Attribute | Description |
|-----------|-------------|
| Primary User | Farmers with basic to moderate digital literacy |
| Age Group | 25–65 years |
| Device Usage | Mobile-first, also tablet and desktop |
| Language | English (primary) |
| Technical Skill | Low to medium |

### 2.4 Constraints

- API keys must remain server-side only
- Must work on Chrome, Firefox, Edge (latest 2 versions)
- MySQL 8.x as the database engine
- Java 17+ and Node.js 18+ for development
- Internet connection required for weather, market, and chatbot features

### 2.5 Assumptions and Dependencies

- Farmers have valid email addresses for registration
- OpenWeatherMap API key is provisioned by the project team
- Government market price data may be cached when live API is unavailable
- Dialogflow agent is pre-configured with agriculture intents
- SMTP server available for OTP-based password reset (or console fallback in dev)

---

## 3. Functional Requirements

### 3.1 Authentication Module (FR-AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | System shall allow user signup with Full Name, Email, Phone, Password, Confirm Password | High |
| FR-AUTH-02 | System shall validate email format, password strength (min 8 chars, 1 uppercase, 1 digit), and Indian mobile (10 digits) | High |
| FR-AUTH-03 | System shall reject duplicate email registrations | High |
| FR-AUTH-04 | Passwords shall be stored using BCrypt hashing | High |
| FR-AUTH-05 | System shall authenticate users via email and password and issue JWT token | High |
| FR-AUTH-06 | System shall support "Remember Me" with extended token expiry | Medium |
| FR-AUTH-07 | Protected routes shall redirect unauthenticated users to login | High |
| FR-AUTH-08 | Forgot password shall send OTP to registered email | High |
| FR-AUTH-09 | User shall verify OTP and reset password | High |

### 3.2 User Profile Module (FR-PROFILE)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PROFILE-01 | User shall view and edit profile: photo, name, email, mobile, address, state, district, preferred crop, farm size | High |
| FR-PROFILE-02 | User shall upload profile photo (stored via URL/path) | Medium |
| FR-PROFILE-03 | User shall change password with current password verification | High |
| FR-PROFILE-04 | Profile data shall persist in `profiles` table linked to `users` | High |

### 3.3 Landing Page (FR-LANDING)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LANDING-01 | Public landing page with Hero, About, Features, Benefits, How It Works, Testimonials, FAQ, Contact, Footer | High |
| FR-LANDING-02 | Navigation links to Login and Signup | High |
| FR-LANDING-03 | Contact form shall submit inquiry (stored or emailed) | Medium |

### 3.4 Dashboard (FR-DASH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | Post-login redirect to dashboard | High |
| FR-DASH-02 | Display weather summary card (temp, humidity, wind, condition) | High |
| FR-DASH-03 | Display latest market prices card | High |
| FR-DASH-04 | Display irrigation recommendation card | High |
| FR-DASH-05 | Display daily crop care tip card | High |
| FR-DASH-06 | Display latest government scheme card | High |
| FR-DASH-07 | Display recent notifications card | High |
| FR-DASH-08 | Display recent activities | Medium |

### 3.5 Weather Module (FR-WEATHER)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-WEATHER-01 | Search weather by city or village name | High |
| FR-WEATHER-02 | Detect current location via browser geolocation | Medium |
| FR-WEATHER-03 | Display current weather: temperature, humidity, wind, pressure, visibility, rain probability, sunrise, sunset | High |
| FR-WEATHER-04 | Display 7-day forecast with icons | High |
| FR-WEATHER-05 | Display weather charts using Chart.js | Medium |
| FR-WEATHER-06 | Store search history in `weather_history` | Medium |

### 3.6 Market Price Module (FR-MARKET)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-MARKET-01 | Display crop prices: crop name, market, state, district, min/max/avg price | High |
| FR-MARKET-02 | Search by crop name | High |
| FR-MARKET-03 | Filter by state and district | High |
| FR-MARKET-04 | Sort by price fields | Medium |
| FR-MARKET-05 | Price trend and weekly comparison charts | Medium |
| FR-MARKET-06 | Data sourced via backend government/market API with DB fallback | High |

### 3.7 Irrigation Module (FR-IRRIGATION)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-IRRIGATION-01 | Accept crop type, soil type, weather condition as inputs | High |
| FR-IRRIGATION-02 | Output water requirement, recommended time, irrigation frequency | High |
| FR-IRRIGATION-03 | Rule-based recommendations (e.g., Rice + Rain → delay 2 days) | High |
| FR-IRRIGATION-04 | Store recommendation history per user | High |

### 3.8 Crop Care Module (FR-CROP)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CROP-01 | Advisory content for Rice, Wheat, Cotton, Sugarcane, Maize | High |
| FR-CROP-02 | Categories: health tips, fertilizer, pest control, disease prevention | High |
| FR-CROP-03 | Search and filter advisories | Medium |

### 3.9 Disease Alert Module (FR-DISEASE)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DISEASE-01 | Display disease name, symptoms, causes, prevention, treatment | High |
| FR-DISEASE-02 | Alert card UI with search and category filter | High |
| FR-DISEASE-03 | Disease alerts trigger notifications | Medium |

### 3.10 Government Scheme Module (FR-SCHEME)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SCHEME-01 | Display scheme details: name, description, eligibility, benefits, process, link, last date | High |
| FR-SCHEME-02 | Search and filter by state | High |
| FR-SCHEME-03 | Save/bookmark schemes per user | Medium |
| FR-SCHEME-04 | View full scheme details page | High |

### 3.11 Chatbot Module (FR-CHAT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CHAT-01 | Chat window with user and bot messages | High |
| FR-CHAT-02 | Integration with Google Dialogflow via backend | High |
| FR-CHAT-03 | Answer weather, crop, irrigation, market, scheme questions | High |
| FR-CHAT-04 | Suggested questions and chat history persistence | Medium |

### 3.12 Notification Module (FR-NOTIF)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NOTIF-01 | Notification types: weather, market, disease, scheme | High |
| FR-NOTIF-02 | Bell icon with unread count | High |
| FR-NOTIF-03 | Mark as read and view history | High |

### 3.13 Additional Features (FR-EXTRA)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EXTRA-01 | Dark mode toggle with persisted preference | Medium |
| FR-EXTRA-02 | Export reports as PDF | Medium |
| FR-EXTRA-03 | Global search functionality | Medium |
| FR-EXTRA-04 | Loading skeletons, success toasts, error handling, empty states | High |

---

## 4. Non-Functional Requirements

### 4.1 Performance

- Page load under 3 seconds on 4G connection
- API response under 2 seconds for cached data
- Dashboard initial render under 1.5 seconds

### 4.2 Security

- JWT-based stateless authentication
- BCrypt password encryption (strength 12)
- Input validation on all endpoints
- Parameterized queries (JPA) preventing SQL injection
- XSS protection via output encoding and Content Security headers
- CORS restricted to frontend origin

### 4.3 Usability

- Responsive design: mobile (320px+), tablet (768px+), desktop (1024px+)
- Agriculture green theme (#2E7D32 primary)
- Clear typography and touch-friendly controls (min 44px tap targets)

### 4.4 Reliability

- Graceful degradation when external APIs fail
- Seed data for offline demonstration
- Transaction management for write operations

### 4.5 Maintainability

- Layered architecture: Controller → Service → Repository
- DTO pattern for API contracts
- Centralized exception handling
- Modular React component structure

### 4.6 Scalability

- Stateless backend suitable for horizontal scaling
- Database indexes on frequently queried columns
- Pagination for list endpoints

---

## 5. External Interface Requirements

### 5.1 User Interfaces

- Web browser SPA with Bootstrap 5 and custom CSS
- Agriculture-themed professional UI without excessive animations

### 5.2 Hardware Interfaces

- Standard keyboard, mouse, touch input
- GPS for optional location-based weather

### 5.3 Software Interfaces

| Interface | Protocol | Purpose |
|-----------|----------|---------|
| MySQL 8.x | JDBC | Data persistence |
| OpenWeatherMap | HTTPS REST | Weather data |
| data.gov.in / Agmarknet | HTTPS REST | Market prices |
| Google Dialogflow | HTTPS REST | Chatbot NLP |
| SMTP | TLS | OTP email delivery |

### 5.4 Communication Interfaces

- REST API over HTTPS (HTTP in development)
- JSON request/response format
- JWT in Authorization header: `Bearer <token>`

---

## 6. System Features Summary

| Module | Input | Output |
|--------|-------|--------|
| Auth | Credentials | JWT, user session |
| Profile | User details | Updated profile |
| Weather | City/location | Forecast data, charts |
| Market | Filters | Price list, trends |
| Irrigation | Crop/soil/weather | Recommendation |
| Crop Care | Search/filter | Advisory articles |
| Disease | Search/filter | Alert cards |
| Schemes | Search/filter | Scheme details |
| Chatbot | User message | Bot response |
| Notifications | System events | Alert list |

---

## 7. Acceptance Criteria

1. All 10 core modules are functional without runtime errors
2. User can complete full flow: signup → login → dashboard → all modules
3. JWT protects all authenticated endpoints
4. Database schema matches ER diagram with referential integrity
5. UI is responsive across three breakpoints
6. API documentation matches implemented endpoints
7. No API keys exposed in frontend bundle
8. Project builds successfully with Maven and npm

---

## 8. Appendices

### Appendix A – Technology Stack

- Frontend: HTML5, CSS3, JavaScript ES6+, React 18, React Router, Axios, Context API, Chart.js, Bootstrap 5
- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, JWT, Maven
- Database: MySQL 8

### Appendix B – Glossary

- **AgroPulse:** The product name
- **Farmer:** The sole application user role
- **Advisory:** Crop care recommendation content
- **Scheme:** Government agricultural subsidy or support program

---

*End of Software Requirement Specification*
