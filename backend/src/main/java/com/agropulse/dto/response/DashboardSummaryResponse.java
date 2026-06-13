package com.agropulse.dto.response;

import java.util.List;

public class DashboardSummaryResponse {

    private WeatherResponse weather;
    private MarketPriceResponse marketHighlight;
    private IrrigationResponse latestIrrigation;
    private CropAdvisoryResponse cropTip;
    private long unreadNotifications;
    private long savedSchemesCount;
    private List<RecentActivityResponse> recentActivities;

    public WeatherResponse getWeather() { return weather; }
    public void setWeather(WeatherResponse weather) { this.weather = weather; }
    public MarketPriceResponse getMarketHighlight() { return marketHighlight; }
    public void setMarketHighlight(MarketPriceResponse marketHighlight) { this.marketHighlight = marketHighlight; }
    public IrrigationResponse getLatestIrrigation() { return latestIrrigation; }
    public void setLatestIrrigation(IrrigationResponse latestIrrigation) { this.latestIrrigation = latestIrrigation; }
    public CropAdvisoryResponse getCropTip() { return cropTip; }
    public void setCropTip(CropAdvisoryResponse cropTip) { this.cropTip = cropTip; }
    public long getUnreadNotifications() { return unreadNotifications; }
    public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    public long getSavedSchemesCount() { return savedSchemesCount; }
    public void setSavedSchemesCount(long savedSchemesCount) { this.savedSchemesCount = savedSchemesCount; }
    public List<RecentActivityResponse> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<RecentActivityResponse> recentActivities) { this.recentActivities = recentActivities; }
}
