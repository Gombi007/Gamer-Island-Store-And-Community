package com.gombino.mynotes.models.entities;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("game-categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Tag(name = "Category collection")
public class GameCategory {
    @Id
    private String id;
    private String category;
}
