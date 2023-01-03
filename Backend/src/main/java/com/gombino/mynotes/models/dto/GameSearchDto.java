package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameSearchDto {
    private String searchText;
    private String sortByField;
    private Boolean isAscending;
    private List<String> languages;
    private List<String> genres;
    private List<String> opSystems;
    private List<String> categories;
    private Boolean isHideFreeGames;
    private Boolean isHideAdultGames;
    private Boolean showOnlyAdultGames;
    private Integer price;
    private Boolean isHideMyOwnGames;
    private Boolean isHideMyWishlistGames;
}
