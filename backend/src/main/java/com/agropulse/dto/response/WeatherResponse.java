package com.agropulse.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class WeatherResponse {

    private String city;
    private String country;
    private BigDecimal temperature;
    private BigDecimal feelsLike;
    private BigDecimal humidity;
    private BigDecimal windSpeed;
    private Integer pressure;
    private Integer visibility;
    private Integer rainProbability;
    private String condition;
    private String icon;
    private String sunrise;
    private String sunset;
    private List<ForecastDayResponse> forecast;
    private boolean fallbackData;

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public BigDecimal getTemperature() { return temperature; }
    public void setTemperature(BigDecimal temperature) { this.temperature = temperature; }
    public BigDecimal getFeelsLike() { return feelsLike; }
    public void setFeelsLike(BigDecimal feelsLike) { this.feelsLike = feelsLike; }
    public BigDecimal getHumidity() { return humidity; }
    public void setHumidity(BigDecimal humidity) { this.humidity = humidity; }
    public BigDecimal getWindSpeed() { return windSpeed; }
    public void setWindSpeed(BigDecimal windSpeed) { this.windSpeed = windSpeed; }
    public Integer getPressure() { return pressure; }
    public void setPressure(Integer pressure) { this.pressure = pressure; }
    public Integer getVisibility() { return visibility; }
    public void setVisibility(Integer visibility) { this.visibility = visibility; }
    public Integer getRainProbability() { return rainProbability; }
    public void setRainProbability(Integer rainProbability) { this.rainProbability = rainProbability; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getSunrise() { return sunrise; }
    public void setSunrise(String sunrise) { this.sunrise = sunrise; }
    public String getSunset() { return sunset; }
    public void setSunset(String sunset) { this.sunset = sunset; }
    public List<ForecastDayResponse> getForecast() { return forecast; }
    public void setForecast(List<ForecastDayResponse> forecast) { this.forecast = forecast; }
    public boolean isFallbackData() { return fallbackData; }
    public void setFallbackData(boolean fallbackData) { this.fallbackData = fallbackData; }
}
