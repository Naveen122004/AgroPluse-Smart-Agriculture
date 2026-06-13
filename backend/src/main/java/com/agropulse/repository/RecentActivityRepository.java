package com.agropulse.repository;

import com.agropulse.model.RecentActivity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecentActivityRepository extends JpaRepository<RecentActivity, Long> {

    @Query("SELECT r FROM RecentActivity r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<RecentActivity> findTop10ByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);
}
