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
    private String name;
    private String requiredAge;
    private Boolean isFree;
    private String detailedDescription;
    private String aboutTheGame;
    private String shortDescription;
    private String supportedLanguages;
    private String headerImage;
    private String website;
    private List<String> developers;
    private List<String> publishers;
    private Double price;
    private List<String> platforms;
    private List<String> genres;
    private Map<String, Object>[] screenshots;
    private Map<String, Object>[] movies;
    private Map<String, Object> releaseDate;
    private String background;
    private String backgroundRaw;
    private List<String> users;
    private List<String> wishlistUsers;
}
