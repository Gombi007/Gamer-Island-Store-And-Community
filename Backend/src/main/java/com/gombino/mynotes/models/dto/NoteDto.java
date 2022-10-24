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
    private Boolean isUrgent;
    private String created;
    private String lastModified;
    private String imgUrl;
    private String creatorId;


}
