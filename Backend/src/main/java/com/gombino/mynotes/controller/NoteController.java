package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.Note;
import com.gombino.mynotes.repositories.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    @Autowired
    NoteRepository noteRepository;

    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping
    public ResponseEntity<Object> getNotes() {
        Note note = new Note();
        note.setText("Test note here!");
        note.setIsUrgent(true);

        return ResponseEntity.status(HttpStatus.OK).body(noteRepository.save(note));
    }

}
