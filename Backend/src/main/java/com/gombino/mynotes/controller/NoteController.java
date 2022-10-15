package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.dto.NoteDto;
import com.gombino.mynotes.repositories.NoteRepository;
import com.gombino.mynotes.services.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@Slf4j
@Tag(name = "NoteController", description = "Manages notes")
public class NoteController {
    @Autowired
    NoteRepository noteRepository;
    @Autowired
    NoteService noteService;

    public NoteController(NoteRepository noteRepository, NoteService noteService) {
        this.noteRepository = noteRepository;
        this.noteService = noteService;
    }

    @Operation(description = "List all notes Or Just urgent and non urgent notes")
    @GetMapping()
    public ResponseEntity<Object> getNotesByUrgentOrNotOrAll(@RequestParam(required = false) String isUrgent) {
        return ResponseEntity.status(HttpStatus.OK).body(noteService.getNotesByUrgentOrNotOrAll(isUrgent));
    }

    @Operation(description = "Create a new note")
    @PostMapping()
    public ResponseEntity<Object> createNote(@RequestBody NoteDto noteDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.createNote(noteDto));
    }

    @Operation(description = "Modify a note")
    @PutMapping()
    public ResponseEntity<Object> modifyNote(@RequestBody NoteDto noteDto, @RequestParam(required = true) String id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.modifyNote(noteDto, id));
    }

    @Operation(description = "Remove a note")
    @DeleteMapping()
    public ResponseEntity<Object> removeNoteById(@RequestParam(required = true) String id) {
        noteService.removeNoteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
