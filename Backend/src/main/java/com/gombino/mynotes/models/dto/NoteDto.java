package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteDto {
    private String id;
    private String title;
    private String text;
    private String link;
    private String imgUrl;
    private String ytUrl;
    private String videoUrl;
    private Boolean visibilityOnlyForMe;
    private Boolean isFavorite;
    private String created;
    private String lastModified;
    private String creatorId;
    private String creatorAvatar;
    private String creatorUsername;
}
