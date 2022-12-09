package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.GameLanguage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameLanguageRepository extends MongoRepository<GameLanguage, String> {

    List<GameLanguage> findAll();

    Boolean existsByLanguage(String genre);

}
