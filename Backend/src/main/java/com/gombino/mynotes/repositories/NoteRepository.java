package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.entities.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends MongoRepository<Note, String> {

    Page<Note> findByVisibilityOnlyForMe(boolean privateNote, Pageable pageable);

    @Query("{$and:[{ id:{$in:?0}} , {$or: [{visibilityOnlyForMe:false} , {creatorId:?1} ]} ]}")
    Page<Note> findFavoriteNotes(List<String> ids, String creatorId, Pageable pageable);

    @Query(value = "{'creatorId':?0}")
    Page<Note> findAllAllNotesByUser(String creatorId, Pageable pageable);

    @Query("{name:'?0'}")
    Note findItemByName(String name);

    @Query(value = "{'visibilityOnlyForMe':false }")
    List<Note> findAllPublicNotes();

    public long count();
}
