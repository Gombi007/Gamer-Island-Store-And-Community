package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.GameGenre;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameGenreRepository extends MongoRepository<GameGenre, String> {

    List<GameGenre> findAll();

    Boolean existsByGenre(String genre);

}
