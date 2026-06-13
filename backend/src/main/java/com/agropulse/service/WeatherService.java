package com.agropulse.service;

import com.agropulse.dto.response.ForecastDayResponse;
import com.agropulse.dto.response.WeatherResponse;
import com.agropulse.model.User;
import com.agropulse.model.WeatherHistory;
import com.agropulse.repository.WeatherHistoryRepository;
import com.agropulse.security.CustomUserDetailsService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");

    private final RestTemplate restTemplate;
    private final WeatherHistoryRepository weatherHistoryRepository;
    private final CustomUserDetailsService userDetailsService;
    private final ActivityService activityService;

    @Value("${weather.api.key:}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String weatherApiUrl;

    public WeatherService(
            RestTemplate restTemplate,
            WeatherHistoryRepository weatherHistoryRepository,
            CustomUserDetailsService userDetailsService,
            ActivityService activityService) {
        this.restTemplate = restTemplate;
        this.weatherHistoryRepository = weatherHistoryRepository;
        this.userDetailsService = userDetailsService;
        this.activityService = activityService;
    }

    @Transactional
    public WeatherResponse getCurrentWeather(String email, String city) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        WeatherResponse response = fetchCurrentWeather(city);
        saveHistory(user, response, null);
        activityService.logActivity(user, "WEATHER", "Checked weather for " + response.getCity());
        return response;
    }

    public WeatherResponse getForecast(String email, String city) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        WeatherResponse current = fetchCurrentWeather(city);
        List<ForecastDayResponse> forecast = fetchForecast(city);
        current.setForecast(forecast);
        activityService.logActivity(user, "WEATHER", "Viewed forecast for " + current.getCity());
        return current;
    }

    @Transactional
    public WeatherResponse getWeatherByLocation(String email, double lat, double lon) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        WeatherResponse response = fetchWeatherByCoordinates(lat, lon);
        saveHistory(user, response, null);
        activityService.logActivity(user, "WEATHER", "Checked weather by location");
        return response;
    }

    public List<WeatherResponse> getHistory(String email) {
        User user = userDetailsService.loadUserEntityByEmail(email);
        return weatherHistoryRepository.findByUserIdOrderBySearchedAtDesc(user.getId()).stream()
                .map(this::historyToResponse)
                .toList();
    }

    public WeatherResponse fetchCurrentWeather(String city) {
        if (apiKey == null || apiKey.isBlank()) {
            return buildFallbackWeather(city);
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(weatherApiUrl + "/weather")
                    .queryParam("q", city)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            return mapCurrentWeather(root, false);
        } catch (Exception ex) {
            log.warn("Weather API failed for city {}: {}", city, ex.getMessage());
            return buildFallbackWeather(city);
        }
    }

    private WeatherResponse fetchWeatherByCoordinates(double lat, double lon) {
        if (apiKey == null || apiKey.isBlank()) {
            return buildFallbackWeather("Your Location");
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(weatherApiUrl + "/weather")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            return mapCurrentWeather(root, false);
        } catch (Exception ex) {
            log.warn("Weather API failed for coordinates {},{}: {}", lat, lon, ex.getMessage());
            return buildFallbackWeather("Your Location");
        }
    }

    private List<ForecastDayResponse> fetchForecast(String city) {
        if (apiKey == null || apiKey.isBlank()) {
            return buildFallbackForecast();
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl(weatherApiUrl + "/forecast")
                    .queryParam("q", city)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            return mapForecast(root);
        } catch (Exception ex) {
            log.warn("Forecast API failed for city {}: {}", city, ex.getMessage());
            return buildFallbackForecast();
        }
    }

    private WeatherResponse mapCurrentWeather(JsonNode root, boolean fallback) {
        WeatherResponse response = new WeatherResponse();
        response.setFallbackData(fallback);
        response.setCity(root.path("name").asText("Unknown"));
        response.setCountry(root.path("sys").path("country").asText("IN"));
        response.setTemperature(decimal(root.path("main").path("temp").asDouble(28.0)));
        response.setFeelsLike(decimal(root.path("main").path("feels_like").asDouble(30.0)));
        response.setHumidity(decimal(root.path("main").path("humidity").asDouble(60.0)));
        response.setWindSpeed(decimal(root.path("wind").path("speed").asDouble(3.5)));
        response.setPressure(root.path("main").path("pressure").asInt(1012));
        response.setVisibility(root.path("visibility").asInt(10000));
        response.setRainProbability(root.path("clouds").path("all").asInt(20));
        JsonNode weather = root.path("weather").get(0);
        if (weather != null) {
            response.setCondition(capitalize(weather.path("description").asText("Clear sky")));
            response.setIcon(weather.path("icon").asText("01d"));
        } else {
            response.setCondition("Clear sky");
            response.setIcon("01d");
        }
        response.setSunrise(formatUnixTime(root.path("sys").path("sunrise").asLong(0)));
        response.setSunset(formatUnixTime(root.path("sys").path("sunset").asLong(0)));
        return response;
    }

    private List<ForecastDayResponse> mapForecast(JsonNode root) {
        Map<LocalDate, ForecastDayResponse> daily = new LinkedHashMap<>();
        for (JsonNode item : root.path("list")) {
            LocalDate date = Instant.ofEpochSecond(item.path("dt").asLong())
                    .atZone(ZoneId.systemDefault()).toLocalDate();
            ForecastDayResponse day = daily.computeIfAbsent(date, d -> {
                ForecastDayResponse f = new ForecastDayResponse();
                f.setDate(d);
                f.setMinTemp(decimal(item.path("main").path("temp_min").asDouble(20)));
                f.setMaxTemp(decimal(item.path("main").path("temp_max").asDouble(32)));
                f.setHumidity(decimal(item.path("main").path("humidity").asDouble(60)));
                JsonNode weather = item.path("weather").get(0);
                f.setCondition(weather != null ? capitalize(weather.path("description").asText("Clear")) : "Clear");
                f.setIcon(weather != null ? weather.path("icon").asText("01d") : "01d");
                f.setRainProbability(item.path("pop").asInt(0) * 100);
                return f;
            });
            BigDecimal tempMin = decimal(item.path("main").path("temp_min").asDouble());
            BigDecimal tempMax = decimal(item.path("main").path("temp_max").asDouble());
            if (tempMin.compareTo(day.getMinTemp()) < 0) {
                day.setMinTemp(tempMin);
            }
            if (tempMax.compareTo(day.getMaxTemp()) > 0) {
                day.setMaxTemp(tempMax);
            }
        }
        return new ArrayList<>(daily.values()).stream().limit(7).toList();
    }

    private WeatherResponse buildFallbackWeather(String city) {
        WeatherResponse response = new WeatherResponse();
        response.setFallbackData(true);
        response.setCity(city == null || city.isBlank() ? "Delhi" : city);
        response.setCountry("IN");
        response.setTemperature(new BigDecimal("32.0"));
        response.setFeelsLike(new BigDecimal("35.0"));
        response.setHumidity(new BigDecimal("65"));
        response.setWindSpeed(new BigDecimal("12.5"));
        response.setPressure(1012);
        response.setVisibility(10000);
        response.setRainProbability(20);
        response.setCondition("Partly Cloudy");
        response.setIcon("02d");
        response.setSunrise("05:23 AM");
        response.setSunset("07:15 PM");
        return response;
    }

    private List<ForecastDayResponse> buildFallbackForecast() {
        List<ForecastDayResponse> forecast = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            ForecastDayResponse day = new ForecastDayResponse();
            day.setDate(LocalDate.now().plusDays(i));
            day.setMinTemp(new BigDecimal(String.valueOf(22 + i)));
            day.setMaxTemp(new BigDecimal(String.valueOf(34 + i % 3)));
            day.setHumidity(new BigDecimal("60"));
            day.setCondition(i % 2 == 0 ? "Partly Cloudy" : "Clear sky");
            day.setIcon(i % 2 == 0 ? "02d" : "01d");
            day.setRainProbability(15 + i * 5);
            forecast.add(day);
        }
        return forecast;
    }

    private void saveHistory(User user, WeatherResponse response, String rawData) {
        WeatherHistory history = new WeatherHistory();
        history.setUser(user);
        history.setCity(response.getCity());
        history.setTemperature(response.getTemperature());
        history.setHumidity(response.getHumidity());
        history.setWindSpeed(response.getWindSpeed());
        history.setConditionText(response.getCondition());
        history.setRawData(rawData);
        weatherHistoryRepository.save(history);
    }

    private WeatherResponse historyToResponse(WeatherHistory history) {
        WeatherResponse response = new WeatherResponse();
        response.setCity(history.getCity());
        response.setTemperature(history.getTemperature());
        response.setHumidity(history.getHumidity());
        response.setWindSpeed(history.getWindSpeed());
        response.setCondition(history.getConditionText());
        return response;
    }

    private BigDecimal decimal(double value) {
        return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP);
    }

    private String formatUnixTime(long epochSeconds) {
        if (epochSeconds <= 0) {
            return "--";
        }
        return Instant.ofEpochSecond(epochSeconds)
                .atZone(ZoneId.systemDefault())
                .format(TIME_FORMAT);
    }

    private String capitalize(String text) {
        if (text == null || text.isBlank()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase(Locale.ROOT) + text.substring(1);
    }
}
