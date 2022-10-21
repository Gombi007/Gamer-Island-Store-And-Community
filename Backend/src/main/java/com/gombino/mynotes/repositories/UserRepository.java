package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    @Query("{username:'?0'}")
    User getUserByUsername(String username);
}
