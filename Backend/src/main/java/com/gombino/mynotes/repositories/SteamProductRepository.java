package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.SteamProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SteamProductRepository extends MongoRepository<SteamProduct, String> {
    Page<SteamProduct> findAll(Pageable pageable);
}