package com.gombino.mynotes.models.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("note")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    @Id
    private String id;
    private String text;
    private Boolean isUrgent;
}
