package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.NoteDto;

import java.util.List;


public interface NoteService {

    List<NoteDto> getNotesByUrgentOrNotOrAll(String isUrgent);

    void createNote(NoteDto noteDto, String userID);

    NoteDto modifyNote(NoteDto noteDto, String id);

    void removeNoteById(String id);

}
