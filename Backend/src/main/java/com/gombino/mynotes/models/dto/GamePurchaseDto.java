package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GamePurchaseDto {
    private String userId;
    private String gameId;
    private String item;
    private String purchaseDate;
    private Double price;
}
