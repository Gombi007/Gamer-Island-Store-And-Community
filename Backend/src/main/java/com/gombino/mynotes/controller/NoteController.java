package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.dto.NoteDto;
import com.gombino.mynotes.services.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "NoteController", description = "Manages notes")
public class NoteController {
    private final NoteService noteService;

    @Operation(description = "List all notes Or Just urgent and non urgent notes")
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> getNotesByUrgentOrNotOrAll(@RequestParam(required = false) String isUrgent, @PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK).body(noteService.getNotesByUrgentOrNotOrAll(isUrgent, userId));
    }

    @Operation(description = "Create a new note")
    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> createNote(@RequestBody NoteDto noteDto, @PathVariable String userId) {
        noteService.createNote(noteDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(description = "Modify a note")
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> modifyNote(@RequestBody NoteDto noteDto, @RequestParam(required = true) String noteId, @PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.modifyNote(noteDto, noteId, userId));
    }

    @Operation(description = "Remove a note")
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> removeNoteById(@RequestParam(required = true) String noteId, @PathVariable String userId) {
        noteService.removeNoteById(noteId, userId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
