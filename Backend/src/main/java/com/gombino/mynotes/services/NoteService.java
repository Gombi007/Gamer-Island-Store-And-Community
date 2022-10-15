package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.NoteDto;

import java.util.List;


public interface NoteService {

    List<NoteDto> getNotesByUrgentOrNotOrAll(String isUrgent);

    NoteDto createNote(NoteDto noteDto);

    NoteDto modifyNote(NoteDto noteDto, String id);

    void removeNoteById(String id);

}
