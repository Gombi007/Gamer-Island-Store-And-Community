package com.gombino.mynotes.models.entities;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document("games")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Tag(name = "Game entity")
public class Game {
    @Id
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
    private List<String> genres;
    private List<String> screenshots;
    private List<String> movies;
    private Map<String, Object> releaseDate;
    private Double price;
    private String background;
    private String backgroundRaw;
    private Boolean isAdult;
    private List<String> users;
    private List<String> wishlistUsers;
}
