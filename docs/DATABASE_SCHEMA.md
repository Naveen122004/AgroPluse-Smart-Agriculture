# Database Schema – AgroPulse

## 1. ER Diagram

```mermaid
erDiagram
    USERS ||--o| PROFILES : has
    USERS ||--o{ WEATHER_HISTORY : searches
    USERS ||--o{ IRRIGATION_HISTORY : receives
    USERS ||--o{ NOTIFICATIONS : gets
    USERS ||--o{ CHAT_HISTORY : chats
    USERS ||--o{ SAVED_SCHEMES : bookmarks
    GOVERNMENT_SCHEMES ||--o{ SAVED_SCHEMES : saved_by

    USERS {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar phone
        varchar password
        boolean remember_me
        boolean enabled
        timestamp created_at
        timestamp updated_at
    }

    PROFILES {
        bigint id PK
        bigint user_id FK UK
        varchar profile_photo
        varchar address
        varchar state
        varchar district
        varchar preferred_crop
        decimal farm_size
        timestamp created_at
        timestamp updated_at
    }

    WEATHER_HISTORY {
        bigint id PK
        bigint user_id FK
        varchar city
        decimal temperature
        decimal humidity
        decimal wind_speed
        varchar condition_text
        text raw_data
        timestamp searched_at
    }

    MARKET_PRICES {
        bigint id PK
        varchar crop_name
        varchar market_name
        varchar state
        varchar district
        decimal min_price
        decimal max_price
        decimal avg_price
        date price_date
        timestamp created_at
    }

    IRRIGATION_HISTORY {
        bigint id PK
        bigint user_id FK
        varchar crop_type
        varchar soil_type
        varchar weather_condition
        varchar water_requirement
        varchar recommended_time
        varchar irrigation_frequency
        text recommendation
        timestamp created_at
    }

    CROP_ADVISORIES {
        bigint id PK
        varchar crop_name
        varchar category
        varchar title
        text content
        varchar season
        timestamp created_at
    }

    DISEASE_ALERTS {
        bigint id PK
        varchar disease_name
        varchar crop_affected
        varchar category
        text symptoms
        text causes
        text prevention
        text treatment
        varchar severity
        boolean active
        timestamp created_at
    }

    GOVERNMENT_SCHEMES {
        bigint id PK
        varchar scheme_name
        text description
        text eligibility
        text benefits
        text application_process
        varchar official_link
        date last_date
        varchar state
        boolean active
        timestamp created_at
    }

    SAVED_SCHEMES {
        bigint id PK
        bigint user_id FK
        bigint scheme_id FK
        timestamp saved_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        varchar type
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    CHAT_HISTORY {
        bigint id PK
        bigint user_id FK
        varchar sender
        text message
        timestamp created_at
    }

    PASSWORD_RESET_OTP {
        bigint id PK
        varchar email
        varchar otp
        timestamp expires_at
        boolean used
        timestamp created_at
    }

    RECENT_ACTIVITIES {
        bigint id PK
        bigint user_id FK
        varchar activity_type
        varchar description
        timestamp created_at
    }
```

## 2. Table Definitions

### 2.1 users

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| full_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| phone | VARCHAR(15) | NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| enabled | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

**Indexes:** `idx_users_email` (UNIQUE)

### 2.2 profiles

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users(id), UNIQUE, NOT NULL |
| profile_photo | VARCHAR(500) | NULL |
| address | VARCHAR(255) | NULL |
| state | VARCHAR(100) | NULL |
| district | VARCHAR(100) | NULL |
| preferred_crop | VARCHAR(100) | NULL |
| farm_size | DECIMAL(10,2) | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

**Indexes:** `idx_profiles_user_id` (UNIQUE)

### 2.3 weather_history

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users(id), NOT NULL |
| city | VARCHAR(100) | NOT NULL |
| temperature | DECIMAL(5,2) | NULL |
| humidity | DECIMAL(5,2) | NULL |
| wind_speed | DECIMAL(5,2) | NULL |
| condition_text | VARCHAR(100) | NULL |
| raw_data | TEXT | NULL |
| searched_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_weather_user_id`, `idx_weather_city`

### 2.4 market_prices

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| crop_name | VARCHAR(100) | NOT NULL |
| market_name | VARCHAR(150) | NOT NULL |
| state | VARCHAR(100) | NOT NULL |
| district | VARCHAR(100) | NOT NULL |
| min_price | DECIMAL(10,2) | NOT NULL |
| max_price | DECIMAL(10,2) | NOT NULL |
| avg_price | DECIMAL(10,2) | NOT NULL |
| price_date | DATE | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_market_crop`, `idx_market_state`, `idx_market_district`

### 2.5 irrigation_history

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users(id), NOT NULL |
| crop_type | VARCHAR(50) | NOT NULL |
| soil_type | VARCHAR(50) | NOT NULL |
| weather_condition | VARCHAR(50) | NOT NULL |
| water_requirement | VARCHAR(100) | NOT NULL |
| recommended_time | VARCHAR(100) | NOT NULL |
| irrigation_frequency | VARCHAR(100) | NOT NULL |
| recommendation | TEXT | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_irrigation_user_id`

### 2.6 crop_advisories

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| crop_name | VARCHAR(50) | NOT NULL |
| category | VARCHAR(50) | NOT NULL |
| title | VARCHAR(200) | NOT NULL |
| content | TEXT | NOT NULL |
| season | VARCHAR(50) | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_advisory_crop`, `idx_advisory_category`

### 2.7 disease_alerts

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| disease_name | VARCHAR(150) | NOT NULL |
| crop_affected | VARCHAR(100) | NOT NULL |
| category | VARCHAR(50) | NOT NULL |
| symptoms | TEXT | NOT NULL |
| causes | TEXT | NOT NULL |
| prevention | TEXT | NOT NULL |
| treatment | TEXT | NOT NULL |
| severity | VARCHAR(20) | DEFAULT 'MEDIUM' |
| active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_disease_crop`, `idx_disease_category`

### 2.8 government_schemes

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| scheme_name | VARCHAR(200) | NOT NULL |
| description | TEXT | NOT NULL |
| eligibility | TEXT | NOT NULL |
| benefits | TEXT | NOT NULL |
| application_process | TEXT | NOT NULL |
| official_link | VARCHAR(500) | NULL |
| last_date | DATE | NULL |
| state | VARCHAR(100) | DEFAULT 'All India' |
| active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_scheme_state`, `idx_scheme_name`

### 2.9 saved_schemes

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users(id), NOT NULL |
| scheme_id | BIGINT | FK → government_schemes(id), NOT NULL |
| saved_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Constraints:** UNIQUE(user_id, scheme_id)

### 2.10 notifications

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users(id), NOT NULL |
| type | VARCHAR(30) | NOT NULL |
| title | VARCHAR(200) | NOT NULL |
| message | TEXT | NOT NULL |
| is_read | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_notif_user_id`, `idx_notif_read`

### 2.11 chat_history

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users(id), NOT NULL |
| sender | VARCHAR(10) | NOT NULL (USER/BOT) |
| message | TEXT | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_chat_user_id`

### 2.12 password_reset_otp

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| email | VARCHAR(150) | NOT NULL |
| otp | VARCHAR(6) | NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| used | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_otp_email`

### 2.13 recent_activities

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users(id), NOT NULL |
| activity_type | VARCHAR(50) | NOT NULL |
| description | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Indexes:** `idx_activity_user_id`

## 3. Referential Integrity

- `profiles.user_id` → `users.id` ON DELETE CASCADE
- `weather_history.user_id` → `users.id` ON DELETE CASCADE
- `irrigation_history.user_id` → `users.id` ON DELETE CASCADE
- `notifications.user_id` → `users.id` ON DELETE CASCADE
- `chat_history.user_id` → `users.id` ON DELETE CASCADE
- `saved_schemes.user_id` → `users.id` ON DELETE CASCADE
- `saved_schemes.scheme_id` → `government_schemes.id` ON DELETE CASCADE
- `recent_activities.user_id` → `users.id` ON DELETE CASCADE

## 4. Normalization

Database is in **Third Normal Form (3NF)**:

- No repeating groups (advisories, diseases, schemes in separate tables)
- All non-key attributes depend on the whole primary key
- No transitive dependencies between non-key attributes

---

*AgroPulse Database Schema v1.0*
