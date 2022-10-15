package com.gombino.mynotes.models.entities;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("note")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Tag(name = "Note entity")
public class Note {
    @Id
    private String id;
    private String text;
    private String text2;
    private Boolean isUrgent;
    private Instant created;
    private Instant lastModified;
    private String imgUrl;
}
