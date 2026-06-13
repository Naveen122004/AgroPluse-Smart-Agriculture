# UML Diagrams – AgroPulse

## 1. Use Case Diagram

```mermaid
graph LR
    Farmer((Farmer))

    subgraph AgroPulse System
        UC1[Register Account]
        UC2[Login]
        UC3[Reset Password]
        UC4[Manage Profile]
        UC5[View Dashboard]
        UC6[Check Weather]
        UC7[Monitor Market Prices]
        UC8[Get Irrigation Advice]
        UC9[Browse Crop Care]
        UC10[View Disease Alerts]
        UC11[Explore Govt Schemes]
        UC12[Chat with AI Bot]
        UC13[View Notifications]
        UC14[Export PDF Report]
        UC15[Toggle Dark Mode]
        UC16[Contact Support]
    end

    Farmer --> UC1
    Farmer --> UC2
    Farmer --> UC3
    Farmer --> UC4
    Farmer --> UC5
    Farmer --> UC6
    Farmer --> UC7
    Farmer --> UC8
    Farmer --> UC9
    Farmer --> UC10
    Farmer --> UC11
    Farmer --> UC12
    Farmer --> UC13
    Farmer --> UC14
    Farmer --> UC15
    Farmer --> UC16

    UC5 -.includes.-> UC6
    UC5 -.includes.-> UC7
    UC5 -.includes.-> UC8
```

### Use Case Descriptions

| ID | Use Case | Actor | Description |
|----|----------|-------|-------------|
| UC1 | Register | Farmer | Create account with validated credentials |
| UC2 | Login | Farmer | Authenticate and receive JWT token |
| UC3 | Reset Password | Farmer | OTP-based password recovery |
| UC4 | Manage Profile | Farmer | Edit personal and farm details |
| UC5 | View Dashboard | Farmer | See aggregated farm insights |
| UC6 | Check Weather | Farmer | Search and view weather forecasts |
| UC7 | Monitor Prices | Farmer | View and analyze crop market prices |
| UC8 | Irrigation Advice | Farmer | Get water scheduling recommendations |
| UC9 | Crop Care | Farmer | Read crop health and fertilizer tips |
| UC10 | Disease Alerts | Farmer | View disease warnings and treatments |
| UC11 | Govt Schemes | Farmer | Browse and save government schemes |
| UC12 | AI Chatbot | Farmer | Ask questions via Dialogflow bot |
| UC13 | Notifications | Farmer | Receive and manage alerts |

---

## 2. Class Diagram

```mermaid
classDiagram
    class User {
        -Long id
        -String fullName
        -String email
        -String phone
        -String password
        -Boolean enabled
        -LocalDateTime createdAt
        +getUsername()
    }

    class Profile {
        -Long id
        -String profilePhoto
        -String address
        -String state
        -String district
        -String preferredCrop
        -BigDecimal farmSize
    }

    class AuthService {
        +signup(SignupRequest) AuthResponse
        +login(LoginRequest) AuthResponse
        +forgotPassword(email) void
        +resetPassword(request) void
    }

    class WeatherService {
        +getCurrentWeather(city) WeatherDTO
        +getForecast(city) List~ForecastDTO~
        +getByLocation(lat, lon) WeatherDTO
    }

    class IrrigationService {
        +getRecommendation(request) IrrigationDTO
        +getHistory(userId) List~IrrigationHistory~
    }

    class MarketService {
        +getPrices(filters) Page~MarketPrice~
        +getTrends(crop) TrendDTO
        +searchCrop(crop) List~MarketPrice~
    }

    class ChatbotService {
        +sendMessage(userId, message) ChatResponse
        +getHistory(userId) List~ChatHistory~
    }

    class NotificationService {
        +create(userId, type, title, msg) Notification
        +getUnreadCount(userId) int
        +markAsRead(id) void
    }

    class JwtTokenProvider {
        +generateToken(user, rememberMe) String
        +validateToken(token) boolean
        +getUserIdFromToken(token) Long
    }

    User "1" --> "0..1" Profile : has
    AuthService --> User : manages
    AuthService --> JwtTokenProvider : uses
    WeatherService --> WeatherHistory : saves
    IrrigationService --> IrrigationHistory : saves
    ChatbotService --> ChatHistory : saves
    NotificationService --> Notification : manages
```

---

## 3. Sequence Diagram – User Login

```mermaid
sequenceDiagram
    actor Farmer
    participant FE as React Frontend
    participant API as AuthController
    participant SVC as AuthService
    participant DB as UserRepository
    participant JWT as JwtTokenProvider

    Farmer->>FE: Enter email & password
    FE->>FE: Validate form inputs
    FE->>API: POST /api/auth/login
    API->>SVC: login(LoginRequest)
    SVC->>DB: findByEmail(email)
    DB-->>SVC: User entity
    SVC->>SVC: BCrypt.matches(password)
    alt Password valid
        SVC->>JWT: generateToken(user, rememberMe)
        JWT-->>SVC: JWT token
        SVC-->>API: AuthResponse
        API-->>FE: 200 OK + token
        FE->>FE: Store token in localStorage
        FE->>Farmer: Redirect to Dashboard
    else Password invalid
        SVC-->>API: BadRequestException
        API-->>FE: 401 Unauthorized
        FE->>Farmer: Show error toast
    end
```

---

## 4. Sequence Diagram – Weather Forecast

```mermaid
sequenceDiagram
    actor Farmer
    participant FE as WeatherPage
    participant API as WeatherController
    participant SVC as WeatherService
    participant OWM as OpenWeatherMap API
    participant DB as WeatherHistoryRepository

    Farmer->>FE: Search "Pune"
    FE->>API: GET /api/weather/current?city=Pune
    API->>SVC: getCurrentWeather("Pune")
    SVC->>OWM: GET /weather?q=Pune&appid=KEY
    alt API Success
        OWM-->>SVC: Weather JSON
        SVC->>SVC: Map to WeatherDTO
        SVC->>DB: save(WeatherHistory)
        SVC-->>API: WeatherDTO
        API-->>FE: 200 OK
        FE->>Farmer: Display weather + charts
    else API Failure
        SVC-->>API: Cached/fallback data
        API-->>FE: 200 OK (degraded)
        FE->>Farmer: Show data with warning
    end
```

---

## 5. Sequence Diagram – Irrigation Recommendation

```mermaid
sequenceDiagram
    actor Farmer
    participant FE as IrrigationPage
    participant API as IrrigationController
    participant SVC as IrrigationService
    participant DB as IrrigationHistoryRepository
    participant ACT as ActivityService

    Farmer->>FE: Select Rice + Clay + Rain Forecast
    FE->>API: POST /api/irrigation/recommend
    API->>SVC: getRecommendation(request)
    SVC->>SVC: Apply rule engine
    Note over SVC: Rice + Rain → Delay 2 days
    SVC->>DB: save(IrrigationHistory)
    SVC->>ACT: logActivity(userId, "IRRIGATION")
    SVC-->>API: IrrigationDTO
    API-->>FE: 200 OK
    FE->>Farmer: Display recommendation
```

---

## 6. Sequence Diagram – Chatbot Interaction

```mermaid
sequenceDiagram
    actor Farmer
    participant FE as ChatbotPage
    participant API as ChatbotController
    participant SVC as ChatbotService
    participant DF as Dialogflow API
    participant DB as ChatHistoryRepository

    Farmer->>FE: "What is wheat price?"
    FE->>API: POST /api/chatbot/message
    API->>SVC: sendMessage(userId, message)
    SVC->>DB: save(user message)
    SVC->>DF: detectIntent(message)
    alt Dialogflow Available
        DF-->>SVC: Intent + Response
    else Fallback Mode
        SVC->>SVC: Keyword-based response
    end
    SVC->>DB: save(bot message)
    SVC-->>API: ChatResponse
    API-->>FE: 200 OK
    FE->>Farmer: Display bot reply + suggestions
```

---

## 7. Activity Diagram – Forgot Password

```mermaid
flowchart TD
    A[User clicks Forgot Password] --> B[Enter email]
    B --> C{Valid email format?}
    C -->|No| D[Show validation error]
    D --> B
    C -->|Yes| E{Email exists in DB?}
    E -->|No| F[Show generic message]
    E -->|Yes| G[Generate 6-digit OTP]
    G --> H[Send OTP via email]
    H --> I[User enters OTP]
    I --> J{OTP valid and not expired?}
    J -->|No| K[Show invalid OTP error]
    K --> I
    J -->|Yes| L[User enters new password]
    L --> M{Password meets requirements?}
    M -->|No| N[Show password rules]
    N --> L
    M -->|Yes| O[BCrypt hash and update]
    O --> P[Mark OTP as used]
    P --> Q[Redirect to Login]
```

---

*AgroPulse UML Diagrams v1.0*
