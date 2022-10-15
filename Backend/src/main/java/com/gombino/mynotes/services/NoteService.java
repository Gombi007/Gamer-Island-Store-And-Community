package com.gombino.mynotes.services;

import com.gombino.mynotes.models.entities.Note;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NoteService {

    List<Note> getNotesByUrgentOrNotOrAll(String isUrgent);

    Note createNote(Note note);

    Note modifyNote(Note note, String id);

    void removeNoteById(String id);

}
