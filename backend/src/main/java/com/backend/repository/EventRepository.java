package com.backend.repository;

import com.backend.model.Event;
import com.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    // Find events by owner
    List<Event> findByOwner(User owner);

    // Find events where user is a participant
    List<Event> findByUsersContaining(User user);

    // Find events by owner or where user is a participant
    @Query("{'$or': [{'owner.$id.$oid': ?0}, {'users.$id.$oid': ?0}]}")
    List<Event> findByOwnerOrUsersContaining(String userId);

    // Find events within a date range
    List<Event> findByStartBetween(LocalDateTime start, LocalDateTime end);

    // Find events by priority
    List<Event> findByPriority(String priority);

    // Find events by recurring pattern
    List<Event> findByRecurring(String recurring);

    // Find events by tags
    List<Event> findByTagsContaining(String tag);

    // Find events by owner within date range
    List<Event> findByOwnerAndStartBetween(User owner, LocalDateTime start, LocalDateTime end);

    // Find events where user is participant within date range
    List<Event> findByUsersContainingAndStartBetween(User user, LocalDateTime start, LocalDateTime end);
}