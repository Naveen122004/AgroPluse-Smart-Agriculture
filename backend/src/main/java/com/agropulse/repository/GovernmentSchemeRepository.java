package com.agropulse.repository;

import com.agropulse.model.GovernmentScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GovernmentSchemeRepository extends JpaRepository<GovernmentScheme, Long> {

    List<GovernmentScheme> findByActiveTrueOrderByPublishDateDesc();

    List<GovernmentScheme> findByActiveTrue();

    List<GovernmentScheme> findByActiveTrueAndStateIgnoreCase(String state);

    List<GovernmentScheme> findByActiveTrueAndCategoryIgnoreCase(String category);

    List<GovernmentScheme> findTop5ByActiveTrueOrderByPublishDateDesc();

    List<GovernmentScheme> findByActiveTrueAndPublishDateAfterOrderByPublishDateDesc(LocalDate date);

    Optional<GovernmentScheme> findBySchemeNameIgnoreCase(String schemeName);

    boolean existsBySchemeNameIgnoreCase(String schemeName);

    @Query("SELECT g FROM GovernmentScheme g WHERE g.active = true AND ("
            + "LOWER(g.schemeName) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(g.description) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(g.benefits) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(g.category) LIKE LOWER(CONCAT('%', :query, '%'))) "
            + "ORDER BY g.publishDate DESC")
    List<GovernmentScheme> searchActiveByKeyword(@Param("query") String query);

    @Query("SELECT DISTINCT g.category FROM GovernmentScheme g WHERE g.active = true ORDER BY g.category")
    List<String> findAllActiveCategories();

    @Query("SELECT DISTINCT g.state FROM GovernmentScheme g WHERE g.active = true ORDER BY g.state")
    List<String> findAllActiveStates();
}
