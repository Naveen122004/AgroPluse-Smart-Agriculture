package com.agropulse.repository;

import com.agropulse.model.DiseaseAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiseaseAlertRepository extends JpaRepository<DiseaseAlert, Long> {

    List<DiseaseAlert> findByActiveTrue();

    List<DiseaseAlert> findByActiveTrueAndCropAffectedIgnoreCase(String cropAffected);

    List<DiseaseAlert> findByActiveTrueAndCategoryIgnoreCase(String category);

    List<DiseaseAlert> findByActiveTrueAndCropAffectedIgnoreCaseAndCategoryIgnoreCase(String cropAffected, String category);

    @Query("SELECT d FROM DiseaseAlert d WHERE d.active = true AND ("
            + "LOWER(d.diseaseName) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(d.cropAffected) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(d.symptoms) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<DiseaseAlert> searchActiveByKeyword(@Param("query") String query);
}
