package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.entities.Note;
import com.gombino.mynotes.repositories.NoteRepository;
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

    public NoteController(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @GetMapping()
    public ResponseEntity<Object> getNotesByUrgentOrNotOrAll(@RequestParam(required = false) String isUrgent) {
        if (isUrgent != null && !isUrgent.isEmpty()) {
            Boolean isUrgentBoolean = false;
            try {
                isUrgentBoolean = Boolean.parseBoolean(isUrgent);
            } catch (Exception exception) {
                log.warn(exception.getMessage());
            }
            return ResponseEntity.status(HttpStatus.OK).body(noteRepository.findAllUrgentNotes(isUrgentBoolean));
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(noteRepository.findAll());
        }
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
