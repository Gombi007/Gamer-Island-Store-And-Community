package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.NoteDto;
import com.gombino.mynotes.models.entities.Note;
import com.gombino.mynotes.repositories.NoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.AbstractConverter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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
                    .map(this::convertToNoteDto)
                    .collect(Collectors.toList());
        } else {
            return noteRepository.findAll().stream()
                    .map(this::convertToNoteDto)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public NoteDto createNote(NoteDto noteDto) {
        Note note = convertToNoteEntity(noteDto);
        note.setCreated(Instant.now());
        Note savedNote = noteRepository.save(note);
        return convertToNoteDto(savedNote);
    }

    @Override
    public NoteDto modifyNote(NoteDto noteDto, String id) {
        Note originalNote = noteRepository.findById(id).orElseThrow(() -> new NoSuchElementException("There is no note with this ID"));
        originalNote.setText(noteDto.getText());
        originalNote.setText2(noteDto.getText2());
        originalNote.setIsUrgent(noteDto.getIsUrgent());
        originalNote.setImgUrl(noteDto.getImgUrl());
        originalNote.setLastModified(Instant.now());
        Note modifiedNote = noteRepository.save(originalNote);
        return convertToNoteDto(modifiedNote);
    }

    @Override
    public void removeNoteById(String id) {
        Note note = noteRepository.findById(id).orElseThrow(() -> new NoSuchElementException("There is no note with this id"));
        noteRepository.delete(note);
    }


    //Converters
    private NoteDto convertToNoteDto(Note note) {
        modelMapper.addConverter(stringDateFormat);
        return modelMapper.map(note, NoteDto.class);
    }

    private Note convertToNoteEntity(NoteDto noteDto) {
        return modelMapper.map(noteDto, Note.class);
    }

    Converter<Instant, String> stringDateFormat = new AbstractConverter<Instant, String>() {
        @Override
        protected String convert(Instant source) {
            if (source != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss").withZone(ZoneId.systemDefault());
                return formatter.format(source);
            }
            return "";
        }
    };
}
