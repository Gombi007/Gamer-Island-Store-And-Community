package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.dto.NoteDto;
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
    public ResponseEntity<Object> createNote(@RequestBody NoteDto noteDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.createNote(noteDto));
    }

    @PutMapping()
    public ResponseEntity<Object> modifyNote(@RequestBody NoteDto noteDto, @RequestParam(required = true) String id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.modifyNote(noteDto, id));
    }

    @DeleteMapping()
    public ResponseEntity<Object> removeNoteById(@RequestParam(required = true) String id) {
        noteService.removeNoteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
