package com.agropulse.repository;

import com.agropulse.model.MarketPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {

    Page<MarketPrice> findByCropNameContainingIgnoreCase(String cropName, Pageable pageable);

    List<MarketPrice> findByStateIgnoreCase(String state);

    List<MarketPrice> findByStateIgnoreCaseAndDistrictIgnoreCase(String state, String district);

    List<MarketPrice> findByCropNameContainingIgnoreCase(String cropName);
}
