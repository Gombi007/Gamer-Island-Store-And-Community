package com.gombino.mynotes.services;

import com.gombino.mynotes.exceptions.PermissionDeniedException;
import com.gombino.mynotes.models.dto.NoteDto;
import com.gombino.mynotes.models.entities.Note;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.repositories.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.AbstractConverter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NoteServiceImpl implements NoteService {
    private final NoteRepository noteRepository;
    private final ModelMapper modelMapper;
    private final UserService userService;


    @Override
    public List<NoteDto> getNotesByUrgentOrNotOrAll(String isUrgent, String userId) {
        User user = userService.getUserById(userId);
        if (isUrgent != null && !isUrgent.isEmpty()) {
            boolean isUrgentBoolean = Boolean.parseBoolean(isUrgent);
            return noteRepository.findAllUrgentNotesByCreator(user.getId(), isUrgentBoolean).stream()
                    .map(this::convertToNoteDto)
                    .collect(Collectors.toList());
        } else {
            return noteRepository.findAllNotesByCreator(user.getId()).stream()
                    .map(this::convertToNoteDto)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public void createNote(NoteDto noteDto, String userId) {
        User user = userService.getUserById(userId);

        Note note = convertToNoteEntity(noteDto);
        note.setCreated(Instant.now());
        note.setCreatorId(user.getId());
        Note savedNote = noteRepository.save(note);

        if (user.getNoteIds() == null) {
            user.setNoteIds(new ArrayList<>());
        }
        user.getNoteIds().add(savedNote.getId());
        userService.updateUser(user);

    }

    @Override
    public NoteDto modifyNote(NoteDto noteDto, String noteId, String userId) {
        User user = userService.getUserById(userId);
        Note originalNote = noteRepository.findById(noteId).orElseThrow(() -> new NoSuchElementException("There is no note with this ID"));
        if (user.getId().equals(originalNote.getCreatorId())) {
            originalNote.setText(noteDto.getText());
            originalNote.setText2(noteDto.getText2());
            originalNote.setIsUrgent(noteDto.getIsUrgent());
            originalNote.setImgUrl(noteDto.getImgUrl());
            originalNote.setLastModified(Instant.now());
            Note modifiedNote = noteRepository.save(originalNote);
            return convertToNoteDto(modifiedNote);
        }
        throw new PermissionDeniedException("You can modify just your own notes");
    }

    @Override
    public void removeNoteById(String noteId, String userId) {
        User user = userService.getUserById(userId);
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new NoSuchElementException("There is no note with this id"));
        if (user.getId().equals(note.getCreatorId())) {
            noteRepository.delete(note);
        } else {
            throw new PermissionDeniedException("You can delete just your own notes");
        }
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
