package com.agropulse.repository;

import com.agropulse.model.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {

    @Query("SELECT c FROM ChatHistory c WHERE c.user.id = :userId ORDER BY c.createdAt ASC")
    List<ChatHistory> findByUserIdOrderByCreatedAtAsc(@Param("userId") Long userId);
}
