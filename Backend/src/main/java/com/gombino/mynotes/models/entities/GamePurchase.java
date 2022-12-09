package com.gombino.mynotes.models.entities;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("game-purchases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Tag(name = "Game purchases")
public class GamePurchase {
    @Id
    private String id;
    private String userId;
    private String gameId;
    private String item;
    private Instant purchaseDate;
    private Double price;
}
