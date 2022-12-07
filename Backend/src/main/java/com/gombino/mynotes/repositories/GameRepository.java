package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {

    Page<Game> findAll(Pageable pageable);

    @Query("{'isFree' : false}")
    Page<Game> findAllWithoutFree(Pageable pageable);

    @Query("{'price' : { $lt: ?0 } }")
    Page<Game> findAllByPriceLessThan(Integer price, Pageable pageable);

    @Query("{'isFree' : true}")
    Page<Game> findAllisFree(Pageable pageable);

    @Query("{$or: [{'isFree' : true},{'price' : { $lt: ?0 }}]}")
    Page<Game> findAllByPriceOrFree(Integer price, Pageable pageable);

    @Query("{$and: [{'isFree' : false},{'price' : { $lt: ?0 }}]}")
    Page<Game> findAllByPriceWithoutFree(Integer price, Pageable pageable);
}