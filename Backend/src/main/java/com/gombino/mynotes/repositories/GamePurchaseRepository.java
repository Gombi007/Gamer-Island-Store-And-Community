package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.GamePurchase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GamePurchaseRepository extends MongoRepository<GamePurchase, String> {

    List<GamePurchase> findAll();

    List<GamePurchase> findByUserId(String userId);

}
