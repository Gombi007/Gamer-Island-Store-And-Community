package com.gombino.mynotes.services;

import com.gombino.mynotes.exceptions.PermissionDeniedException;
import com.gombino.mynotes.models.dto.NoteDto;
import com.gombino.mynotes.models.dto.PaginationInfo;
import com.gombino.mynotes.models.dto.PaginationSorterDto;
import com.gombino.mynotes.models.entities.Note;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.repositories.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.AbstractConverter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NoteServiceImpl implements NoteService {
    private final NoteRepository noteRepository;
    private final ModelMapper modelMapper;
    private final UserService userService;

    private final WebSocketService webSocketService;


    @Override
    public HashMap<String, Object> getPublicOrFavoritesOrMyNotes(String favOrMyNotes, String userId, PaginationSorterDto paginationSorterDto) {
        User user = userService.getUserById(userId);
        List<NoteDto> noteDtoList = new ArrayList<>();

        if (favOrMyNotes == null) {
            Pageable paging = PageRequest.of(paginationSorterDto.getPage(), paginationSorterDto.getSize(), Sort.by(paginationSorterDto.getSortBy()).ascending());
            Page<Note> noteList = noteRepository.findByVisibilityOnlyForMe(false, paging);
            PaginationInfo paginationInfo = new PaginationInfo(noteList.getNumber(), noteList.getTotalPages(), noteList.getTotalElements());
            for (Note note : noteList) {
                noteDtoList.add(addCreatorInfoToNoteDto(note));
            }
            return setTheNoteDtoFavoriteIfThatOnTheUserFavList(user, noteDtoList, paginationInfo);
        }

        if (favOrMyNotes.equals("favorites")) {
            Pageable paging = PageRequest.of(paginationSorterDto.getPage(), paginationSorterDto.getSize(), Sort.by(paginationSorterDto.getSortBy()).descending());
            List<String> favoriteNotes = user.getFavoriteNotesIds();
            Page<Note> noteList = noteRepository.findFavoriteNotes(favoriteNotes, user.getId(), paging);
            PaginationInfo paginationInfo = new PaginationInfo(noteList.getNumber(), noteList.getTotalPages(), noteList.getTotalElements());
            for (Note note : noteList) {
                noteDtoList.add(addCreatorInfoToNoteDto(note));
            }
            return setTheNoteDtoFavoriteIfThatOnTheUserFavList(user, noteDtoList, paginationInfo);
        }

        if (favOrMyNotes.equals("my-notes")) {
            Pageable paging = PageRequest.of(paginationSorterDto.getPage(), paginationSorterDto.getSize(), Sort.by(paginationSorterDto.getSortBy()).descending());
            Page<Note> noteList = noteRepository.findAllAllNotesByUser(user.getId(), paging);
            PaginationInfo paginationInfo = new PaginationInfo(noteList.getNumber(), noteList.getTotalPages(), noteList.getTotalElements());
            for (Note note : noteList) {
                noteDtoList.add(addCreatorInfoToNoteDto(note));
            }
            return setTheNoteDtoFavoriteIfThatOnTheUserFavList(user, noteDtoList, paginationInfo);
        }
        return null;
    }


    private NoteDto addCreatorInfoToNoteDto(Note note) {
        NoteDto noteDto = convertToNoteDto(note);
        User creator = userService.getUserById(note.getCreatorId());
        noteDto.setCreatorUsername(creator.getUsername());
        noteDto.setCreatorAvatar(creator.getAvatar());
        return noteDto;
    }

    private HashMap<String, Object> setTheNoteDtoFavoriteIfThatOnTheUserFavList(User user, List<NoteDto> noteDtoList, PaginationInfo paginationInfo) {
        HashMap<String, Object> result = new HashMap<>();
        for (NoteDto noteDto : noteDtoList) {
            if (user.getFavoriteNotesIds().contains(noteDto.getId())) {
                noteDto.setIsFavorite(true);
            } else {
                noteDto.setIsFavorite(false);
            }
        }
        result.put("page", noteDtoList);
        result.put("paginationInfo", paginationInfo);
        return result;
    }

    @Override
    public NoteDto getNoteById(String userId, String noteId) {
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new NoSuchElementException("There is no note with this ID"));

        if (!note.getVisibilityOnlyForMe()) {
            return addCreatorInfoToNoteDto(note);
        }
        if (note.getCreatorId().equals(userId)) {
            return addCreatorInfoToNoteDto(note);
        }
        return null;
    }

    private String changeYoutubeUrlToEmbeddedMode(String ytUrl) {
        String youtubeId = "";
        String youtubeEmbedUrl = "https://www.youtube.com/embed/";
        String resultYoutubeEmbedUrl = "";
        if (ytUrl != null && ytUrl.length() >= 11) {
            youtubeId = ytUrl.substring(ytUrl.length() - 11);
            resultYoutubeEmbedUrl = youtubeEmbedUrl.concat(youtubeId);
        }
        return resultYoutubeEmbedUrl;

    }

    @Override
    public void createNote(NoteDto noteDto, String userId) {
        User user = userService.getUserById(userId);

        Note note = convertToNoteEntity(noteDto);
        note.setYtUrl(changeYoutubeUrlToEmbeddedMode(noteDto.getYtUrl()));
        note.setCreated(Instant.now());
        note.setCreatorId(user.getId());
        Note savedNote = noteRepository.save(note);
        user.getNoteIds().add(savedNote.getId());
        userService.updateUser(user);
        changeFavoriteState(noteDto.getIsFavorite(), savedNote.getId(), user.getId());
    }

    @Override
    public NoteDto modifyNote(NoteDto noteDto, String noteId, String userId) {
        User user = userService.getUserById(userId);
        Note originalNote = noteRepository.findById(noteId).orElseThrow(() -> new NoSuchElementException("There is no note with this ID"));

        if (user.getId().equals(originalNote.getCreatorId())) {
            originalNote.setTitle(noteDto.getTitle());
            originalNote.setText(noteDto.getText());
            originalNote.setLink(noteDto.getLink());
            originalNote.setImgUrl(noteDto.getImgUrl());
            originalNote.setYtUrl(changeYoutubeUrlToEmbeddedMode(noteDto.getYtUrl()));
            originalNote.setVideoUrl(noteDto.getVideoUrl());
            originalNote.setVideoPosterUrl(noteDto.getVideoPosterUrl());
            originalNote.setVisibilityOnlyForMe(noteDto.getVisibilityOnlyForMe());
            originalNote.setIsFavorite(noteDto.getIsFavorite());
            originalNote.setLastModified(Instant.now());
            originalNote.setHashtags(noteDto.getHashtags());

            changeFavoriteState(noteDto.getIsFavorite(), noteId, userId);
            Note modifiedNote = noteRepository.save(originalNote);

            // send a message to frontend, update the note list due to the list was modified
            Map<String, String> messageToFrontend = new HashMap<>();
            messageToFrontend.put("noteId", originalNote.getId());
            messageToFrontend.put("operation", "modify");
            log.info("Notify fronted method was called: {}", messageToFrontend.get("operation"));
            webSocketService.notifyFrontend(messageToFrontend);
            return convertToNoteDto(modifiedNote);
        }
        throw new PermissionDeniedException("You can modify just your own notes");
    }

    @Override
    public void changeFavoriteState(Boolean isNoteFavorite, String noteId, String userId) {
        User user = userService.getUserById(userId);
        Note originalNote = noteRepository.findById(noteId).orElseThrow(() -> new NoSuchElementException("There is no note with this ID"));
        List<String> userFavoriteNotes = user.getFavoriteNotesIds();

        if (userFavoriteNotes.contains(originalNote.getId()) && !isNoteFavorite) {
            userFavoriteNotes.remove(originalNote.getId());
        }

        if (!userFavoriteNotes.contains(originalNote.getId()) && isNoteFavorite) {
            userFavoriteNotes.add(originalNote.getId());
        }
        userService.updateUser(user);
    }

    @Override
    public void changeVisibility(Boolean visibility, String noteId, String userId) {
        User user = userService.getUserById(userId);
        Note originalNote = noteRepository.findById(noteId).orElseThrow(() -> new NoSuchElementException("There is no note with this ID"));
        if (user.getId().equals(originalNote.getCreatorId())) {
            originalNote.setVisibilityOnlyForMe(visibility);
            originalNote.setLastModified(Instant.now());
            noteRepository.save(originalNote);
        } else {
            throw new PermissionDeniedException("You can modify just your own notes");
        }
        // send a message to frontend, update the note list due to the list was modified
        Map<String, String> messageToFrontend = new HashMap<>();
        messageToFrontend.put("noteId", originalNote.getId());
        messageToFrontend.put("operation", "visibilityChange");
        log.info("Notify fronted method was called: {}", messageToFrontend.get("operation"));
        webSocketService.notifyFrontend(messageToFrontend);

    }

    @Override
    public void removeNoteById(String noteId, String userId) {
        User user = userService.getUserById(userId);
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new NoSuchElementException("There is no note with this id"));

        if (!user.getId().equals(note.getCreatorId())) {
            throw new PermissionDeniedException("You can delete just your own notes");
        }

        userService.getUsers().forEach(u -> {
            if (u.getFavoriteNotesIds().contains(noteId)) {
                u.getFavoriteNotesIds().remove(noteId);
                userService.updateUser(u);
            }
            if (u.getId().equals(note.getCreatorId())) {
                u.getNoteIds().remove(noteId);
                userService.updateUser(u);
            }
        });
        noteRepository.delete(note);
        // send a message to frontend, update the note list due to the list was modified
        Map<String, String> messageToFrontend = new HashMap<>();
        messageToFrontend.put("noteId", note.getId());
        messageToFrontend.put("operation", "remove");
        webSocketService.notifyFrontend(messageToFrontend);
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
