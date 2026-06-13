package com.agropulse.repository;

import com.agropulse.model.SavedScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedSchemeRepository extends JpaRepository<SavedScheme, Long> {

    @Query("SELECT s FROM SavedScheme s WHERE s.user.id = :userId")
    List<SavedScheme> findByUserId(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SavedScheme s "
            + "WHERE s.user.id = :userId AND s.scheme.id = :schemeId")
    boolean existsByUserIdAndSchemeId(@Param("userId") Long userId, @Param("schemeId") Long schemeId);

    @Query("SELECT s FROM SavedScheme s WHERE s.user.id = :userId AND s.scheme.id = :schemeId")
    Optional<SavedScheme> findByUserIdAndSchemeId(@Param("userId") Long userId, @Param("schemeId") Long schemeId);
}
