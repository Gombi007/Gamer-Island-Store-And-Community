package com.gombino.mynotes.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameDto {
    private String id;
    private Long steamAppId;
    private String type;
    private String name;
    private Integer requiredAge;
    private Boolean isFree;
    private String detailedDescription;
    private String aboutTheGame;
    private String shortDescription;
    private String headerImage;
    private String website;
    private Map<String, String> pcRequirements;
    private Map<String, String> macRequirements;
    private Map<String, String> linuxRequirements;
    private List<String> supportedLanguages;
    private List<String> developers;
    private List<String> publishers;
    private List<String> platforms;
    private Map<String, Object> metacritic;
    private List<Map<String, Object>> categories;
    private List<String> genres;
    private List<String> screenshots;
    private List<String> movies;
    private Map<String, Object> releaseDate;
    private Double price;
    private String background;
    private String backgroundRaw;
    private Boolean isAdult;
}
