package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.FilterAdult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface FilterAdultRepository extends MongoRepository<FilterAdult, String> {
    ArrayList<FilterAdult> findAll();
}