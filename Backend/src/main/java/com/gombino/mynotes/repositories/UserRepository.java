package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    @Query("{username:'?0'}")
    Optional<User> findUserByUsername(String username);

    @Query("{id:'?0'}")
    Optional<User> findUserById(String userId);
}