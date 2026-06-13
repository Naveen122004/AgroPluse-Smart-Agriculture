package com.agropulse.service;

import com.agropulse.model.CropAdvisory;
import com.agropulse.model.DiseaseAlert;
import com.agropulse.model.MarketPrice;
import com.agropulse.repository.CropAdvisoryRepository;
import com.agropulse.repository.DiseaseAlertRepository;
import com.agropulse.repository.GovernmentSchemeRepository;
import com.agropulse.repository.MarketPriceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final MarketPriceRepository marketPriceRepository;
    private final CropAdvisoryRepository cropAdvisoryRepository;
    private final DiseaseAlertRepository diseaseAlertRepository;
    private final GovernmentSchemeRepository governmentSchemeRepository;
    private final SchemeSyncService schemeSyncService;

    public DataSeeder(
            MarketPriceRepository marketPriceRepository,
            CropAdvisoryRepository cropAdvisoryRepository,
            DiseaseAlertRepository diseaseAlertRepository,
            GovernmentSchemeRepository governmentSchemeRepository,
            SchemeSyncService schemeSyncService) {
        this.marketPriceRepository = marketPriceRepository;
        this.cropAdvisoryRepository = cropAdvisoryRepository;
        this.diseaseAlertRepository = diseaseAlertRepository;
        this.governmentSchemeRepository = governmentSchemeRepository;
        this.schemeSyncService = schemeSyncService;
    }

    @Override
    public void run(String... args) {
        seedMarketPrices();
        seedCropAdvisories();
        seedDiseaseAlerts();
        // Wipe any old scheme rows that lack publishDate/category, then re-seed via SchemeSyncService
        governmentSchemeRepository.deleteAll();
        schemeSyncService.syncSchemes();
    }

    private void seedMarketPrices() {
        if (marketPriceRepository.count() > 0) {
            return;
        }
        log.info("Seeding market prices...");
        marketPriceRepository.save(createPrice("Rice", "Karnal Mandi", "Haryana", "Karnal", 3100, 3300, 3200));
        marketPriceRepository.save(createPrice("Wheat", "Meerut Mandi", "Uttar Pradesh", "Meerut", 2200, 2400, 2300));
        marketPriceRepository.save(createPrice("Cotton", "Nagpur APMC", "Maharashtra", "Nagpur", 5800, 6200, 6000));
        marketPriceRepository.save(createPrice("Sugarcane", "Kolhapur Market", "Maharashtra", "Kolhapur", 320, 360, 340));
        marketPriceRepository.save(createPrice("Maize", "Indore Mandi", "Madhya Pradesh", "Indore", 1800, 2000, 1900));
        marketPriceRepository.save(createPrice("Onion", "Lasalgaon APMC", "Maharashtra", "Nashik", 1500, 1800, 1650));
    }

    private void seedCropAdvisories() {
        if (cropAdvisoryRepository.count() > 0) {
            return;
        }
        log.info("Seeding crop advisories...");
        cropAdvisoryRepository.save(createAdvisory("Rice", "Planting",
                "Optimal Rice Sowing Window",
                "Sow rice when soil temperature is 20-30°C. Maintain proper nursery management and use certified seeds.",
                "Kharif"));
        cropAdvisoryRepository.save(createAdvisory("Wheat", "Fertilizer",
                "Wheat Nutrient Management",
                "Apply nitrogen in split doses at crown root initiation and flowering. Ensure balanced NPK based on soil test.",
                "Rabi"));
        cropAdvisoryRepository.save(createAdvisory("Cotton", "Pest Control",
                "Cotton Bollworm Monitoring",
                "Scout fields twice weekly for bollworm activity. Use pheromone traps and follow integrated pest management.",
                "Kharif"));
        cropAdvisoryRepository.save(createAdvisory("Sugarcane", "Irrigation",
                "Sugarcane Water Management",
                "Provide irrigation at 10-15 day intervals during formative stage. Avoid waterlogging in heavy soils.",
                "All Season"));
        cropAdvisoryRepository.save(createAdvisory("Maize", "Harvest",
                "Maize Harvest Indicators",
                "Harvest when grains are hard and moisture is around 20-25%. Dry grains to safe storage moisture promptly.",
                "Kharif"));
    }

    private void seedDiseaseAlerts() {
        if (diseaseAlertRepository.count() > 0) {
            return;
        }
        log.info("Seeding disease alerts...");
        diseaseAlertRepository.save(createDisease(
                "Rice Blast",
                "Rice",
                "Fungal",
                "Diamond-shaped lesions on leaves, neck blast on panicles",
                "Magnaporthe oryzae fungus in humid conditions",
                "Use resistant varieties, avoid excessive nitrogen, ensure field drainage",
                "Apply recommended fungicides at early infection stage",
                "HIGH"));
        diseaseAlertRepository.save(createDisease(
                "Wheat Rust",
                "Wheat",
                "Fungal",
                "Orange-brown pustules on leaves and stems",
                "Puccinia spp. spread by wind in cool moist weather",
                "Grow resistant cultivars, destroy volunteer wheat plants",
                "Timely fungicide spray at flag leaf stage",
                "MEDIUM"));
        diseaseAlertRepository.save(createDisease(
                "Cotton Leaf Curl",
                "Cotton",
                "Viral",
                "Upward curling of leaves, stunted plant growth",
                "Whitefly transmitted begomovirus",
                "Control whitefly population, remove infected plants",
                "Roguing and vector management with recommended insecticides",
                "HIGH"));
    }


    private MarketPrice createPrice(String crop, String market, String state, String district,
                                    int min, int max, int avg) {
        MarketPrice price = new MarketPrice();
        price.setCropName(crop);
        price.setMarketName(market);
        price.setState(state);
        price.setDistrict(district);
        price.setMinPrice(BigDecimal.valueOf(min));
        price.setMaxPrice(BigDecimal.valueOf(max));
        price.setAvgPrice(BigDecimal.valueOf(avg));
        price.setPriceDate(LocalDate.now());
        return price;
    }

    private CropAdvisory createAdvisory(String crop, String category, String title, String content, String season) {
        CropAdvisory advisory = new CropAdvisory();
        advisory.setCropName(crop);
        advisory.setCategory(category);
        advisory.setTitle(title);
        advisory.setContent(content);
        advisory.setSeason(season);
        return advisory;
    }

    private DiseaseAlert createDisease(String name, String crop, String category, String symptoms,
                                       String causes, String prevention, String treatment, String severity) {
        DiseaseAlert alert = new DiseaseAlert();
        alert.setDiseaseName(name);
        alert.setCropAffected(crop);
        alert.setCategory(category);
        alert.setSymptoms(symptoms);
        alert.setCauses(causes);
        alert.setPrevention(prevention);
        alert.setTreatment(treatment);
        alert.setSeverity(severity);
        alert.setActive(true);
        return alert;
    }

}
