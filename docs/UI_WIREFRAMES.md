# UI Wireframes – AgroPulse

> Text-based wireframes representing page layouts. Colors: Primary `#2E7D32`, Secondary `#66BB6A`, Accent `#FFB300`.

---

## 1. Landing Page

```
┌─────────────────────────────────────────────────────────────────┐
│ [🌾 AgroPulse]     Home  Features  About  FAQ  Contact  [Login]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   HERO SECTION                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Empowering Farmers Through Smart Technology            │   │
│   │  Real-time weather, market prices, crop care & more       │   │
│   │  [Get Started]  [Learn More]                              │   │
│   │                                    [Farmer Illustration] │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ABOUT AGROPULSE                                               │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│   │ Mission  │  │ Vision   │  │ Values   │                      │
│   └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
│   FEATURES (6 cards in grid)                                    │
│   [Weather] [Market] [Irrigation] [Crop Care] [Disease] [Schemes]│
│                                                                 │
│   BENEFITS          │    HOW IT WORKS                           │
│   ✓ Save time       │    1. Register                            │
│   ✓ Better yields   │    2. Set profile                         │
│   ✓ Smart decisions │    3. Use modules                         │
│                                                                 │
│   TESTIMONIALS (carousel)                                       │
│   FAQ (accordion)                                               │
│   CONTACT FORM                                                  │
│   FOOTER: Links | Social | Copyright                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Login Page

```
┌─────────────────────────────────────────────────────────────────┐
│                    [🌾 AgroPulse Logo]                          │
│                                                                 │
│              ┌─────────────────────────┐                        │
│              │      Welcome Back       │                        │
│              │                         │                        │
│              │  Email    [___________] │                        │
│              │  Password [___________] │                        │
│              │  ☐ Remember Me          │                        │
│              │                         │                        │
│              │     [  Login  ]         │                        │
│              │                         │                        │
│              │  Forgot Password?       │                        │
│              │  Don't have account?    │                        │
│              │  Sign Up                │                        │
│              └─────────────────────────┘                        │
│                                                                 │
│         [Left: Green gradient with farm image]                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ [🌾] Dashboard  Weather  Market  ...        🔔(3)  👤  🌙      │
├─────────────────────────────────────────────────────────────────┤
│  Welcome back, Ramesh!                    [Export PDF]          │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ 🌤 Weather   │ │ 💰 Market    │ │ 💧 Irrigation│            │
│  │ 32°C Sunny   │ │ Wheat ₹2150  │ │ Delay 2 days │            │
│  │ Humidity 65% │ │ Rice ₹3200   │ │ Rice + Rain  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ 🌱 Crop Tip  │ │ 🏛 Schemes   │ │ 🔔 Alerts    │            │
│  │ Apply NPK... │ │ PM-KISAN     │ │ Rust alert   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  RECENT ACTIVITIES                                              │
│  • Checked weather for Delhi - 2 hrs ago                        │
│  • Viewed wheat prices - 5 hrs ago                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Weather Page

```
┌─────────────────────────────────────────────────────────────────┐
│  Weather Forecast                                               │
│  [Search City/Village____] [📍 Use Location] [Search]          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Delhi, IN          ☀️ Partly Cloudy        34°C         │   │
│  │  Feels like 38°C    Humidity 65%   Wind 12 km/h         │   │
│  │  Pressure 1012 hPa  Visibility 10km  Rain 20%           │   │
│  │  🌅 05:23 AM        🌇 07:15 PM                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  7-DAY FORECAST                                                 │
│  [Mon][Tue][Wed][Thu][Fri][Sat][Sun]                           │
│   34°  33°  31°  30°  32°  33°  34°                            │
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐                │
│  │ Temperature Chart   │  │ Humidity Chart      │                │
│  │ [Line Chart]        │  │ [Bar Chart]         │                │
│  └─────────────────────┘  └─────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Market Price Page

```
┌─────────────────────────────────────────────────────────────────┐
│  Market Prices                                                  │
│  [Search Crop___] [State ▼] [District ▼] [Sort: Avg Price ▼]   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Crop    │ Market      │ State  │ Min  │ Max  │ Avg     │   │
│  │─────────│─────────────│────────│──────│──────│─────────│   │
│  │ Wheat   │ Azadpur     │ Delhi  │ 2100 │ 2200 │ 2150    │   │
│  │ Rice    │ Karnal      │ Haryana│ 3100 │ 3300 │ 3200    │   │
│  │ Cotton  │ Nagpur      │ MH     │ 6500 │ 6800 │ 6650    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Price Trend Chart]        [Weekly Comparison Chart]           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Irrigation Page

```
┌─────────────────────────────────────────────────────────────────┐
│  Irrigation Scheduler                                           │
│                                                                 │
│  ┌─────────────────────┐   ┌─────────────────────────────┐     │
│  │ GET RECOMMENDATION  │   │  RESULT                     │     │
│  │                     │   │                             │     │
│  │ Crop Type    [▼]    │   │  💧 Water: Moderate         │     │
│  │ Soil Type    [▼]    │   │  ⏰ Time: Early Morning    │     │
│  │ Weather      [▼]    │   │  📅 Freq: Every 4 days      │     │
│  │                     │   │                             │     │
│  │ [Get Advice]        │   │  Delay irrigation for 2     │     │
│  │                     │   │  days due to rainfall.      │     │
│  └─────────────────────┘   └─────────────────────────────┘     │
│                                                                 │
│  HISTORY                                                        │
│  Rice + Rain → Delay 2 days (Jun 10)                           │
│  Wheat + Hot → Every 3 days (Jun 8)                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Profile Page

```
┌─────────────────────────────────────────────────────────────────┐
│  My Profile                                                     │
│                                                                 │
│  ┌────────┐  Full Name:    [Ramesh Kumar        ]              │
│  │ Photo  │  Email:        ramesh@example.com (readonly)       │
│  │ [Edit] │  Mobile:       [9876543210           ]              │
│  └────────┘  Address:      [Village Rampur      ]              │
│              State:        [Uttar Pradesh  ▼]                   │
│              District:     [Meerut          ▼]                   │
│              Crop:         [Wheat           ▼]                   │
│              Farm Size:    [5.5 acres]                          │
│                                                                 │
│  [Save Changes]                    [Change Password]            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Chatbot Page

```
┌─────────────────────────────────────────────────────────────────┐
│  AgroPulse Assistant                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🤖 Hello! How can I help you today?                    │   │
│  │                                                         │   │
│  │                              What is wheat price? 👤    │   │
│  │  🤖 Current wheat avg price is ₹2150/quintal in Delhi  │   │
│  │                                                         │   │
│  │  Suggested: [Weather today] [Irrigation tips] [Schemes] │   │
│  └─────────────────────────────────────────────────────────┘   │
│  [Type your message________________________] [Send]             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Single column, hamburger menu, stacked cards |
| Tablet (768–1023px) | 2-column grid, collapsible sidebar |
| Desktop (1024px+) | Full navbar, 3-column dashboard grid |

---

*AgroPulse UI Wireframes v1.0*
