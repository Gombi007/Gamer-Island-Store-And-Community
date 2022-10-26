package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends MongoRepository<Note, String> {


    @Query("{name:'?0'}")
    Note findItemByName(String name);

    @Query(value = "{'visibilityOnlyForMe':false }")
    List<Note> findAllPublicNotes();

    @Query(value = "{'creatorId':?0}")
    List<Note> findAllAllNotesByUser(String creatorId);

    public long count();
}
