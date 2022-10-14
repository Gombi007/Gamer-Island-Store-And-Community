package com.gombino.mynotes.repositories;

import com.gombino.mynotes.models.Note;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NoteRepository extends MongoRepository<Note, String> {
}
