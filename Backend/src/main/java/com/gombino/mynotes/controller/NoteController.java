package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.entities.Note;
import com.gombino.mynotes.repositories.NoteRepository;
import com.gombino.mynotes.services.NoteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@Slf4j
public class NoteController {
    @Autowired
    NoteRepository noteRepository;
    @Autowired
    NoteService noteService;

    public NoteController(NoteRepository noteRepository, NoteService noteService) {
        this.noteRepository = noteRepository;
        this.noteService = noteService;
    }

    @GetMapping()
    public ResponseEntity<Object> getNotesByUrgentOrNotOrAll(@RequestParam(required = false) String isUrgent) {
        return ResponseEntity.status(HttpStatus.OK).body(noteService.getNotesByUrgentOrNotOrAll(isUrgent));
    }

    @PostMapping()
    public ResponseEntity<Object> createNote(@RequestBody Note note) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteRepository.save(note));
    }

    @PutMapping()
    public ResponseEntity<Object> modifyNote(@RequestBody Note note, @RequestParam(required = true) String id) {
        Note modifiedNote = noteRepository.findById(id).get();
        modifiedNote.setText(note.getText());
        modifiedNote.setIsUrgent(note.getIsUrgent());
        return ResponseEntity.status(HttpStatus.CREATED).body(noteRepository.save(modifiedNote));
    }

    @DeleteMapping()
    public ResponseEntity<Object> removeNoteById(@RequestParam(required = true) String id) {
        noteRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
