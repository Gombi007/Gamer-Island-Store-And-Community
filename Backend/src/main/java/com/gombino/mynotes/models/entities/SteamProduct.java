package com.gombino.mynotes.models.entities;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("steam_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Tag(name = "Steam product entity")
public class SteamProduct {
    private Instant savedInTheDB;
    private Long appId;
    private String name;
}
