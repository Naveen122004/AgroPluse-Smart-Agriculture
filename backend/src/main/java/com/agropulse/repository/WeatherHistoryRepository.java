package com.agropulse.repository;

import com.agropulse.model.WeatherHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherHistoryRepository extends JpaRepository<WeatherHistory, Long> {

    @Query("SELECT w FROM WeatherHistory w WHERE w.user.id = :userId ORDER BY w.searchedAt DESC")
    List<WeatherHistory> findByUserIdOrderBySearchedAtDesc(@Param("userId") Long userId);
}
