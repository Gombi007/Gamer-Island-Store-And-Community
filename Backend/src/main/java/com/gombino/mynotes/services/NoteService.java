package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.NoteDto;

import java.util.List;


public interface NoteService {

    List<NoteDto> getPublicOrFavoritesOrMyNotes(String favOrMyNotes, String userId);

    void createNote(NoteDto noteDto, String userID);

    NoteDto modifyNote(NoteDto noteDto, String noteId, String userId);

    void removeNoteById(String noteId, String userId);

    void changeFavoriteState(Boolean isNoteFavorite, String noteId, String userId);

    void changeVisibility(Boolean visibility, String noteId, String userId);

}
