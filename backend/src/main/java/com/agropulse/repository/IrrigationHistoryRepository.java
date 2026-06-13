package com.agropulse.repository;

import com.agropulse.model.IrrigationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IrrigationHistoryRepository extends JpaRepository<IrrigationHistory, Long> {

    @Query("SELECT i FROM IrrigationHistory i WHERE i.user.id = :userId ORDER BY i.createdAt DESC")
    List<IrrigationHistory> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
