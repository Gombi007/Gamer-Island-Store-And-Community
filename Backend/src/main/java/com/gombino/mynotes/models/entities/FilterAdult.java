package com.gombino.mynotes.models.entities;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("filter_adult")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Tag(name = "Adult filter collection")
public class FilterAdult {
    private String word;
    private Instant created;
}
