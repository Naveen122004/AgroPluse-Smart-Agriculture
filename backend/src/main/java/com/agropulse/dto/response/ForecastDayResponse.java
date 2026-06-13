package com.agropulse.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ForecastDayResponse {

    private LocalDate date;
    private BigDecimal minTemp;
    private BigDecimal maxTemp;
    private BigDecimal humidity;
    private String condition;
    private String icon;
    private Integer rainProbability;

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public BigDecimal getMinTemp() { return minTemp; }
    public void setMinTemp(BigDecimal minTemp) { this.minTemp = minTemp; }
    public BigDecimal getMaxTemp() { return maxTemp; }
    public void setMaxTemp(BigDecimal maxTemp) { this.maxTemp = maxTemp; }
    public BigDecimal getHumidity() { return humidity; }
    public void setHumidity(BigDecimal humidity) { this.humidity = humidity; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Integer getRainProbability() { return rainProbability; }
    public void setRainProbability(Integer rainProbability) { this.rainProbability = rainProbability; }
}
