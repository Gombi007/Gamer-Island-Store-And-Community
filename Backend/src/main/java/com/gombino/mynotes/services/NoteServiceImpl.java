package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.NoteDto;
import com.gombino.mynotes.models.entities.Note;
import com.gombino.mynotes.repositories.NoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
            boolean isUrgentBoolean = false;
            try {
                isUrgentBoolean = Boolean.parseBoolean(isUrgent);
            } catch (Exception exception) {
                log.warn(exception.getMessage());
            }
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
        return null;
    }

    @Override
    public NoteDto modifyNote(NoteDto noteDto, String id) {
        return null;
    }

    @Override
    public void removeNoteById(String id) {

    }

    private NoteDto convertToDto(Note note) {
        return modelMapper.map(note, NoteDto.class);
    }
}
