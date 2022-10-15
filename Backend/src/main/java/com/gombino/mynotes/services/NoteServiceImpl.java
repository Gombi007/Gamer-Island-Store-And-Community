package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.NoteDto;
import com.gombino.mynotes.models.entities.Note;
import com.gombino.mynotes.repositories.NoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NoteServiceImpl implements NoteService {
    @Autowired
    NoteRepository noteRepository;
    @Autowired
    ModelMapper modelMapper;

    public NoteServiceImpl(NoteRepository noteRepository, ModelMapper modelMapper) {
        this.noteRepository = noteRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<NoteDto> getNotesByUrgentOrNotOrAll(String isUrgent) {
        if (isUrgent != null && !isUrgent.isEmpty()) {
            boolean isUrgentBoolean = Boolean.parseBoolean(isUrgent);
            return noteRepository.findAllUrgentNotes(isUrgentBoolean).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } else {
            return noteRepository.findAll().stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public NoteDto createNote(NoteDto noteDto) {
        Note savedNote = noteRepository.save(convertToEntity(noteDto));
        return convertToDto(savedNote);
    }

    @Override
    public NoteDto modifyNote(NoteDto noteDto, String id) {
        Note originalNote = noteRepository.findById(id).orElseThrow(() -> new NoSuchElementException("There is no note with this ID"));
        originalNote.setText(noteDto.getText());
        originalNote.setIsUrgent(noteDto.getIsUrgent());
        Note modifiedNote = noteRepository.save(originalNote);
        return convertToDto(modifiedNote);
    }

    @Override
    public void removeNoteById(String id) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new NoSuchElementException("There is no note with this id"));
        noteRepository.delete(note);
    }

    private NoteDto convertToDto(Note note) {
        return modelMapper.map(note, NoteDto.class);
    }

    private Note convertToEntity(NoteDto noteDto) {
        return modelMapper.map(noteDto, Note.class);
    }
}
