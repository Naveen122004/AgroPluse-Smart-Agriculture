# Project Roadmap – AgroPulse

## Timeline Overview (16 Weeks)

```
Week  1-2  │████████│ Phase 1-2: Setup & Database
Week  3-4  │████████│ Phase 3-4: Auth & Profile
Week  5-6  │████████│ Phase 5-6: Dashboard & Weather
Week  7-8  │████████│ Phase 7-8: Market & Irrigation
Week  9-10 │████████│ Phase 9-10: Crop Care & Disease
Week 11-12 │████████│ Phase 11-12: Schemes & Chatbot
Week 13-14 │████████│ Phase 13-14: Notifications & Testing
Week 15-16 │████████│ Phase 15: Deployment & Documentation
```

---

## Phase Details

### Phase 1: Project Setup (Week 1)
- [x] Initialize Git repository
- [x] Create documentation (SRS, Architecture, ER, API)
- [x] Set up Spring Boot backend with Maven
- [x] Set up React frontend with Vite
- [x] Configure development environment

### Phase 2: Database Design (Week 2)
- [x] Design normalized schema (13 tables)
- [x] Create SQL DDL script with seed data
- [x] Configure JPA entities and repositories
- [x] Test database connectivity

### Phase 3: Authentication Module (Week 3)
- [ ] Backend: Signup, Login, JWT, BCrypt
- [ ] Backend: Forgot password with OTP
- [ ] Frontend: Login, Signup, Forgot Password pages
- [ ] Protected routes with React Router
- [ ] Remember Me functionality

### Phase 4: Profile Module (Week 4)
- [ ] Backend: Profile CRUD, photo upload, change password
- [ ] Frontend: Profile page with edit form
- [ ] Form validation and error handling

### Phase 5: Dashboard (Week 5)
- [ ] Backend: Dashboard summary API
- [ ] Frontend: Dashboard with 6 summary cards
- [ ] Recent activities section
- [ ] Loading skeletons

### Phase 6: Weather Module (Week 6)
- [ ] Backend: OpenWeatherMap integration
- [ ] Frontend: Weather search, current, forecast
- [ ] Chart.js temperature/humidity charts
- [ ] Geolocation support
- [ ] Weather history storage

### Phase 7: Market Price Module (Week 7)
- [ ] Backend: Market price API + DB seed data
- [ ] Frontend: Price table with search/filter/sort
- [ ] Price trend and weekly comparison charts

### Phase 8: Irrigation Module (Week 8)
- [ ] Backend: Rule-based recommendation engine
- [ ] Frontend: Input form and result display
- [ ] Irrigation history

### Phase 9: Crop Care Module (Week 9)
- [ ] Backend: Advisory CRUD and search
- [ ] Frontend: Category cards, search, filter
- [ ] Seed advisory content for 5 crops

### Phase 10: Disease Alerts (Week 10)
- [ ] Backend: Disease alert data and APIs
- [ ] Frontend: Alert cards with search/filter
- [ ] Auto-generate disease notifications

### Phase 11: Government Schemes (Week 11)
- [ ] Backend: Scheme data, save/bookmark
- [ ] Frontend: Scheme list, detail, filter by state

### Phase 12: Chatbot Integration (Week 12)
- [ ] Backend: Dialogflow integration with fallback
- [ ] Frontend: Chat window, history, suggestions

### Phase 13: Notification System (Week 13)
- [ ] Backend: Notification CRUD, unread count
- [ ] Frontend: Bell icon, dropdown, history page

### Phase 14: Testing (Week 14)
- [ ] Unit tests for services
- [ ] API integration testing
- [ ] Frontend component testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

### Phase 15: Deployment (Week 15-16)
- [ ] Production build configuration
- [ ] Environment variable setup
- [ ] Deploy backend (JAR)
- [ ] Deploy frontend (static build)
- [ ] Final documentation and demo script

---

## Milestones

| Milestone | Target | Deliverable |
|-----------|--------|-------------|
| M1 | Week 2 | Database + project skeleton |
| M2 | Week 4 | Auth + Profile working |
| M3 | Week 6 | Dashboard + Weather live |
| M4 | Week 8 | Market + Irrigation live |
| M5 | Week 10 | Crop Care + Disease live |
| M6 | Week 12 | Schemes + Chatbot live |
| M7 | Week 14 | All modules tested |
| M8 | Week 16 | Deployed + demo ready |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API key unavailable | Seed data + rule-based fallback |
| Dialogflow setup complex | Local NLP fallback with keyword matching |
| Email OTP in dev | Console logging + dev mode bypass |
| Large scope | Modular development, phase gates |

---

*AgroPulse Project Roadmap v1.0*
