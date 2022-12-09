package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.GameCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameCategoryRepository extends MongoRepository<GameCategory, String> {

    List<GameCategory> findAll();

    Boolean existsByCategory(String category);

}
