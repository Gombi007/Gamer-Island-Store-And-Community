package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameSearchDto {
    private Integer price;
    private Boolean isHideFreeGames;
    private Boolean isHideAdultGames;
    private Boolean showOnlyAdultGames;
    private Boolean isHideMyOwnGames;
    private Boolean isHideMyWishlistGames;
    private Boolean isAscending;
    private String sortByField;
    private List<String> genres;
    private List<String> opSystems;
    private List<String> languages;
    private List<String> categories;
}
