package com.agropulse.repository;

import com.agropulse.model.CropAdvisory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropAdvisoryRepository extends JpaRepository<CropAdvisory, Long> {

    List<CropAdvisory> findByCropNameIgnoreCase(String cropName);

    List<CropAdvisory> findByCategoryIgnoreCase(String category);

    List<CropAdvisory> findByCropNameIgnoreCaseAndCategoryIgnoreCase(String cropName, String category);

    @Query("SELECT c FROM CropAdvisory c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(c.content) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "OR LOWER(c.cropName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<CropAdvisory> searchByKeyword(@Param("query") String query);
}
