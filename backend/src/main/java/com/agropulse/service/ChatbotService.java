package com.agropulse.service;

import com.agropulse.dto.response.ChatMessageResponse;
import com.agropulse.dto.response.ChatResponse;
import com.agropulse.dto.response.MarketPriceResponse;
import com.agropulse.dto.response.WeatherResponse;
import com.agropulse.model.ChatHistory;
import com.agropulse.model.User;
import com.agropulse.repository.ChatHistoryRepository;
import com.agropulse.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final Pattern CITY_PATTERN = Pattern.compile(
            "(?:in|at|for)\\s+([A-Za-z\\s]+)", Pattern.CASE_INSENSITIVE);
    private static final Pattern CROP_PATTERN = Pattern.compile(
            "\\b(rice|wheat|cotton|sugarcane|maize|tomato|potato|onion)\\b", Pattern.CASE_INSENSITIVE);

    private final ChatHistoryRepository chatHistoryRepository;
    private final CustomUserDetailsService userDetailsService;
    private final WeatherService weatherService;
    private final MarketService marketService;
    private final CropCareService cropCareService;
    private final SchemeService schemeService;
    private final ActivityService activityService;

    @Value("${dialogflow.enabled:false}")
    private boolean dialogflowEnabled;

    @Value("${dialogflow.project-id:}")
    private String dialogflowProjectId;

    public ChatbotService(
            ChatHistoryRepository chatHistoryRepository,
            CustomUserDetailsService userDetailsService,
            WeatherService weatherService,
            MarketService marketService,
            CropCareService cropCareService,
            SchemeService schemeService,
            ActivityService activityService) {
        this.chatHistoryRepository = chatHistoryRepository;
        this.userDetailsService = userDetailsService;
        this.weatherService = weatherService;
        this.marketService = marketService;
        this.cropCareService = cropCareService;
        this.schemeService = schemeService;
        this.activityService = activityService;
    }

    @Transactional
    public ChatResponse sendMessage(String email, String message) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        saveMessage(user, "USER", message);

        String reply;
        if (dialogflowEnabled && dialogflowProjectId != null && !dialogflowProjectId.isBlank()) {
            reply = tryDialogflow(message);
            if (reply == null) {
                reply = generateKeywordReply(email, message);
            }
        } else {
            reply = generateKeywordReply(email, message);
        }

        saveMessage(user, "BOT", reply);
        activityService.logActivity(user, "CHAT", "Used chatbot assistant");

        List<String> suggestions = buildSuggestions(message);
        return new ChatResponse(reply, suggestions);
    }

    public List<ChatMessageResponse> getHistory(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return chatHistoryRepository.findByUserIdOrderByCreatedAtAsc(user.getId()).stream()
                .map(chat -> new ChatMessageResponse(
                        chat.getId(), chat.getSender(), chat.getMessage(), chat.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<String> getSuggestions(String email) {
        return buildSuggestions("");
    }

    private List<String> buildSuggestions(String lastMessage) {
        List<String> defaults = Arrays.asList(
                "What is the weather in Delhi?",
                "Latest wheat market prices",
                "Irrigation tips for rice",
                "Government schemes for farmers",
                "Crop care advice for cotton"
        );
        if (lastMessage.toLowerCase(Locale.ROOT).contains("weather")) {
            return Arrays.asList("7-day forecast for Pune", "Irrigation tips for rice", "Crop tips for wheat");
        }
        return defaults;
    }

    private String tryDialogflow(String message) {
        // Dialogflow integration placeholder when credentials are configured externally.
        return null;
    }

    private String generateKeywordReply(String email, String message) {
        String lower = message.toLowerCase(Locale.ROOT);

        if (containsAny(lower, "weather", "temperature", "rain", "forecast", "humidity")) {
            return handleWeatherQuestion(message);
        }
        if (containsAny(lower, "price", "market", "rate", "mandi")) {
            return handleMarketQuestion(message);
        }
        if (containsAny(lower, "irrigation", "irrigate", "water", "watering")) {
            return handleIrrigationQuestion(message);
        }
        if (containsAny(lower, "scheme", "government", "subsidy", "pm-kisan", "yojana")) {
            return handleSchemeQuestion(email);
        }
        if (containsAny(lower, "crop", "advisory", "farming tip", "plant", "sow", "harvest")) {
            return handleCropQuestion(message);
        }
        if (containsAny(lower, "disease", "pest", "infection", "blight")) {
            return "Check the Disease Alerts section for symptoms, prevention, and treatment guidance. "
                    + "Early detection helps protect your crop yield.";
        }
        if (containsAny(lower, "hello", "hi", "namaste")) {
            return "Namaste! I am AgroPulse assistant. Ask me about weather, crop care, irrigation, "
                    + "market prices, or government schemes.";
        }

        return "I can help with weather updates, crop advisories, irrigation recommendations, "
                + "market prices, and government schemes. Please ask a specific farming question.";
    }

    private String handleWeatherQuestion(String message) {
        String city = extractCity(message);
        if (city == null || city.isBlank()) {
            city = "Delhi";
        }
        WeatherResponse weather = weatherService.fetchCurrentWeather(city);
        return String.format(Locale.ROOT,
                "The current weather in %s is %s°C with %s. Humidity is %s%% and wind speed is %s m/s.%s",
                weather.getCity(),
                weather.getTemperature(),
                weather.getCondition().toLowerCase(Locale.ROOT),
                weather.getHumidity(),
                weather.getWindSpeed(),
                weather.isFallbackData() ? " (sample data - configure OpenWeather API key for live data)" : "");
    }

    private String handleMarketQuestion(String message) {
        String crop = extractCrop(message);
        if (crop == null) {
            crop = "Wheat";
        }
        List<MarketPriceResponse> prices = marketService.searchByCrop(crop, 0, 3, "avgPrice", "desc").getContent();
        if (prices.isEmpty()) {
            return "No market prices found for " + crop + ". Try checking the Market Prices page.";
        }
        MarketPriceResponse top = prices.get(0);
        return String.format(Locale.ROOT,
                "Latest %s prices at %s (%s): Min ₹%s, Max ₹%s, Avg ₹%s per quintal.",
                top.getCropName(), top.getMarketName(), top.getDistrict(),
                top.getMinPrice(), top.getMaxPrice(), top.getAvgPrice());
    }

    private String handleIrrigationQuestion(String message) {
        String crop = extractCrop(message);
        if (crop == null) {
            crop = "Rice";
        }
        return String.format(Locale.ROOT,
                "For %s, maintain consistent soil moisture. In clay soil with rain forecast, delay irrigation "
                        + "for 2 days. Irrigate early morning (5-7 AM) to reduce evaporation. "
                        + "Use the Irrigation page for personalized recommendations.", crop);
    }

    private String handleSchemeQuestion(String email) {
        List<com.agropulse.dto.response.GovernmentSchemeResponse> schemes =
                schemeService.getAllSchemes(email);
        if (schemes.isEmpty()) {
            return "Government scheme information will be available soon. Visit the Schemes page for updates.";
        }
        com.agropulse.dto.response.GovernmentSchemeResponse scheme = schemes.get(0);
        return "Available scheme: " + scheme.getSchemeName() + ". " + truncate(scheme.getDescription(), 120)
                + " Open the Schemes page for eligibility and application details.";
    }

    private String handleCropQuestion(String message) {
        String crop = extractCrop(message);
        if (crop != null) {
            List<com.agropulse.dto.response.CropAdvisoryResponse> advisories =
                    cropCareService.filterAdvisories(crop, null);
            if (!advisories.isEmpty()) {
                com.agropulse.dto.response.CropAdvisoryResponse advisory = advisories.get(0);
                return advisory.getTitle() + ": " + truncate(advisory.getContent(), 150);
            }
        }
        com.agropulse.dto.response.CropAdvisoryResponse tip = cropCareService.getTipOfDay();
        return tip.getTitle() + ": " + truncate(tip.getContent(), 150);
    }

    private void saveMessage(User user, String sender, String message) {
        ChatHistory chat = new ChatHistory();
        chat.setUser(user);
        chat.setSender(sender);
        chat.setMessage(message);
        chatHistoryRepository.save(chat);
    }

    private String extractCity(String message) {
        Matcher matcher = CITY_PATTERN.matcher(message);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        String[] words = message.split("\\s+");
        if (words.length > 0) {
            String last = words[words.length - 1].replaceAll("[^A-Za-z]", "");
            if (!last.isBlank() && last.length() > 2) {
                return last;
            }
        }
        return null;
    }

    private String extractCrop(String message) {
        Matcher matcher = CROP_PATTERN.matcher(message);
        if (matcher.find()) {
            String crop = matcher.group(1);
            return crop.substring(0, 1).toUpperCase(Locale.ROOT) + crop.substring(1).toLowerCase(Locale.ROOT);
        }
        return null;
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String truncate(String text, int maxLength) {
        if (text == null) {
            return "";
        }
        if (text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }
}
