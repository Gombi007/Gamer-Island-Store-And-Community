package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface NoteRepository extends MongoRepository<Note, String> {


    @Query("{name:'?0'}")
    Note findItemByName(String name);

    @Query(value = "{isUrgent: ?0 }", fields = "{'id' : 0, 'text' : 1, 'isUrgent' : 1}")
    List<Note> findAllUrgentNotes(boolean isUrgent);

    public long count();
}
