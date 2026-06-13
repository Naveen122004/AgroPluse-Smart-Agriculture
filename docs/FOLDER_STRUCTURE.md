# Project Folder Structure – AgroPulse

```
FramSync-Project/
│
├── docs/                              # Project documentation
│   ├── SRS.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── FOLDER_STRUCTURE.md
│   ├── UI_WIREFRAMES.md
│   ├── ROADMAP.md
│   └── DIAGRAMS.md
│
├── database/
│   └── schema.sql                     # MySQL DDL + seed data
│
├── backend/                           # Spring Boot Application
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/agropulse/
│           │   ├── AgroPulseApplication.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── ProfileController.java
│           │   │   ├── WeatherController.java
│           │   │   ├── MarketController.java
│           │   │   ├── IrrigationController.java
│           │   │   ├── CropCareController.java
│           │   │   ├── DiseaseController.java
│           │   │   ├── SchemeController.java
│           │   │   ├── ChatbotController.java
│           │   │   ├── NotificationController.java
│           │   │   ├── DashboardController.java
│           │   │   └── ContactController.java
│           │   ├── service/
│           │   │   ├── AuthService.java
│           │   │   ├── ProfileService.java
│           │   │   ├── WeatherService.java
│           │   │   ├── MarketService.java
│           │   │   ├── IrrigationService.java
│           │   │   ├── CropCareService.java
│           │   │   ├── DiseaseService.java
│           │   │   ├── SchemeService.java
│           │   │   ├── ChatbotService.java
│           │   │   ├── NotificationService.java
│           │   │   ├── DashboardService.java
│           │   │   ├── EmailService.java
│           │   │   └── ActivityService.java
│           │   ├── repository/
│           │   │   ├── UserRepository.java
│           │   │   ├── ProfileRepository.java
│           │   │   ├── WeatherHistoryRepository.java
│           │   │   ├── MarketPriceRepository.java
│           │   │   ├── IrrigationHistoryRepository.java
│           │   │   ├── CropAdvisoryRepository.java
│           │   │   ├── DiseaseAlertRepository.java
│           │   │   ├── GovernmentSchemeRepository.java
│           │   │   ├── SavedSchemeRepository.java
│           │   │   ├── NotificationRepository.java
│           │   │   ├── ChatHistoryRepository.java
│           │   │   ├── PasswordResetOtpRepository.java
│           │   │   └── RecentActivityRepository.java
│           │   ├── model/
│           │   │   ├── User.java
│           │   │   ├── Profile.java
│           │   │   ├── WeatherHistory.java
│           │   │   ├── MarketPrice.java
│           │   │   ├── IrrigationHistory.java
│           │   │   ├── CropAdvisory.java
│           │   │   ├── DiseaseAlert.java
│           │   │   ├── GovernmentScheme.java
│           │   │   ├── SavedScheme.java
│           │   │   ├── Notification.java
│           │   │   ├── ChatHistory.java
│           │   │   ├── PasswordResetOtp.java
│           │   │   └── RecentActivity.java
│           │   ├── dto/
│           │   │   ├── request/
│           │   │   └── response/
│           │   ├── config/
│           │   │   ├── SecurityConfig.java
│           │   │   ├── CorsConfig.java
│           │   │   └── AppConfig.java
│           │   ├── security/
│           │   │   ├── JwtTokenProvider.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   └── CustomUserDetailsService.java
│           │   ├── exception/
│           │   │   ├── GlobalExceptionHandler.java
│           │   │   ├── ResourceNotFoundException.java
│           │   │   └── BadRequestException.java
│           │   └── util/
│           │       └── ApiResponse.java
│           └── resources/
│               ├── application.properties
│               └── application-dev.properties
│
└── frontend/                          # React Application
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   ├── LoadingSkeleton.jsx
        │   │   ├── EmptyState.jsx
        │   │   ├── Toast.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   └── NotificationBell.jsx
        │   ├── dashboard/
        │   │   ├── WeatherCard.jsx
        │   │   ├── MarketCard.jsx
        │   │   ├── IrrigationCard.jsx
        │   │   ├── CropCareCard.jsx
        │   │   ├── SchemeCard.jsx
        │   │   └── NotificationCard.jsx
        │   ├── weather/
        │   │   ├── WeatherSearch.jsx
        │   │   ├── CurrentWeather.jsx
        │   │   ├── ForecastList.jsx
        │   │   └── WeatherChart.jsx
        │   ├── market/
        │   │   ├── PriceTable.jsx
        │   │   ├── PriceFilters.jsx
        │   │   └── PriceChart.jsx
        │   ├── chatbot/
        │   │   ├── ChatWindow.jsx
        │   │   ├── ChatMessage.jsx
        │   │   └── SuggestedQuestions.jsx
        │   └── landing/
        │       ├── HeroSection.jsx
        │       ├── FeaturesSection.jsx
        │       └── TestimonialsSection.jsx
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── SignupPage.jsx
        │   ├── ForgotPasswordPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── WeatherPage.jsx
        │   ├── MarketPage.jsx
        │   ├── IrrigationPage.jsx
        │   ├── CropCarePage.jsx
        │   ├── DiseasePage.jsx
        │   ├── SchemesPage.jsx
        │   ├── ChatbotPage.jsx
        │   └── NotificationsPage.jsx
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   ├── weatherService.js
        │   ├── marketService.js
        │   └── ...
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── ThemeContext.jsx
        │   └── NotificationContext.jsx
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useToast.js
        │   └── useDebounce.js
        ├── layouts/
        │   ├── MainLayout.jsx
        │   └── AuthLayout.jsx
        ├── routes/
        │   └── AppRoutes.jsx
        ├── assets/
        │   └── images/
        └── utils/
            ├── validators.js
            ├── formatters.js
            └── pdfExport.js
```

---

*AgroPulse Folder Structure v1.0*
