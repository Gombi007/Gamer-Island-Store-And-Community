package com.gombino.mynotes.services;

import com.gombino.mynotes.enums.StaticStings;
import com.gombino.mynotes.models.entities.FilterAdult;
import com.gombino.mynotes.models.entities.Game;
import com.gombino.mynotes.models.entities.SteamProduct;
import com.gombino.mynotes.repositories.FilterAdultRepository;
import com.gombino.mynotes.repositories.GameRepository;
import com.gombino.mynotes.repositories.SteamProductRepository;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SteamApiServiceImpl implements SteamApiService {
    private final SteamProductRepository steamProductRepository;
    private final FilterAdultRepository adultRepository;

    private final GameRepository gameRepository;

    private Boolean isTooManyRequest = false;

    @Override
    public void saveAllSteamProductsInTheDB() {
        RestTemplate template = new RestTemplate();
        String url = StaticStings.STEAM_ALL_PRODUCTS_URL.getUrl();
        JsonArray jsonArray;
        List<SteamProduct> steamProducts = new ArrayList<>();
        try {
            ResponseEntity<String> response = template.getForEntity(url, String.class);
            JsonObject responseBody = JsonParser.parseString(Objects.requireNonNull(response.getBody())).getAsJsonObject();
            jsonArray = responseBody.getAsJsonObject("applist").getAsJsonArray("apps");
            for (int i = 0; i < jsonArray.size(); i++) {
                JsonObject app = jsonArray.get(i).getAsJsonObject();
                SteamProduct steamProduct = new SteamProduct(null, Instant.now(), app.get("appid").getAsLong(), app.get("name").getAsString());
                steamProducts.add(steamProduct);
            }
            steamProductRepository.deleteAll();
            steamProductRepository.saveAll(steamProducts);
            log.warn("All steam products was saved in the db");

        } catch (Exception exception) {
            log.warn("The Steam API is not available");
        }
    }


    @Override
    public List<String> getSteamGames(Integer page, Integer size) {
        isTooManyRequest = false;
        List<String> savedGames = new ArrayList<>();
        List<SteamProduct> removeCheckedGames = new ArrayList<>();

        Pageable paging = PageRequest.of(page, size);
        Page<SteamProduct> steamProductPage = steamProductRepository.findAll(paging);
        for (SteamProduct steamProduct : steamProductPage) {
            Game game = getOnlySuccessGameBasedOnAppId(steamProduct.getAppId());
            //adult filter
            if (game != null) {
                game.setIsAdult(isAdultGame(game));
                Game savedGame = gameRepository.save(game);
                savedGames.add(savedGame.getName());
            }
            if (!isTooManyRequest) {
                removeCheckedGames.add(steamProduct);
            } else {
                break;
            }
        }
        steamProductRepository.deleteAll(removeCheckedGames);
        savedGames.add(0, "SAVED: " + savedGames.size() + " GAMES");
        return savedGames;
    }

    private Game getOnlySuccessGameBasedOnAppId(Long appId) {
        RestTemplate template = new RestTemplate();
        String url = StaticStings.STEAM_GAME_DETAILS_URL.getUrl();
        JsonObject steamProduct;
        JsonObject steamProductDataObject;

        try {
            ResponseEntity<String> response = template.getForEntity(url.concat(appId.toString()), String.class);
            JsonObject responseBody = JsonParser.parseString(Objects.requireNonNull(response.getBody())).getAsJsonObject();
            steamProduct = responseBody.getAsJsonObject(appId.toString());
            Boolean isSuccessSteamProduct = steamProduct.getAsJsonPrimitive("success").getAsBoolean();

            if (isSuccessSteamProduct) {
                steamProductDataObject = steamProduct.getAsJsonObject("data");
                Boolean isGame = steamProductDataObject.getAsJsonPrimitive("type").getAsString().equalsIgnoreCase("game");
                if (isGame) {
                    return convertJsonObjectToGame(steamProductDataObject);
                }
            }

        } catch (Exception exception) {
            if (!(exception instanceof NullPointerException)) {

                //logging only success game errors
                if (exception.getMessage() != null) {
                    log.error("Error during the get success game method {}", exception.getMessage());
                }

                // if steam api throw down the connection, set a break variable
                if (exception.getMessage().contains("429 Too Many Requests:")) {
                    isTooManyRequest = true;
                }
            }
        }
        return null;
    }

    private Game convertJsonObjectToGame(JsonObject gameObject) {
        Game game = new Game();
        Long steamAppId = 0L;

        //Fill all game field from json object OR in error case: set default value
        try {
            steamAppId = gameObject.getAsJsonPrimitive("steam_appid").getAsLong();
            game.setSteamAppId(steamAppId);
        } catch (Exception exception) {
            game.setSteamAppId(0L);
            log.error("Error during convert ID:{} game field APPID {}", steamAppId, exception.getMessage());
        }

        try {
            String type = gameObject.getAsJsonPrimitive("type").getAsString();
            game.setType(type);
        } catch (Exception exception) {
            game.setType("");
            log.error("Error during convert ID:{} game field TYPE {}", steamAppId, exception.getMessage());
        }

        try {
            String name = gameObject.getAsJsonPrimitive("name").getAsString();
            game.setName(name);
        } catch (Exception exception) {
            game.setName("");
            log.error("Error during convert ID:{} game field NAME {}", steamAppId, exception.getMessage());
        }

        try {
            Integer requiredAge = gameObject.getAsJsonPrimitive("required_age").getAsInt();
            game.setRequiredAge(requiredAge);
        } catch (Exception exception) {
            game.setRequiredAge(0);
            log.error("Error during convert ID:{} game field REQUIRED AGE {}", steamAppId, exception.getMessage());
        }

        try {
            Boolean isFree = gameObject.getAsJsonPrimitive("is_free").getAsBoolean();
            game.setIsFree(isFree);
        } catch (Exception exception) {
            game.setIsFree(false);
            log.error("Error during convert ID:{} game field IS FREE{}", steamAppId, exception.getMessage());
        }

        try {
            String detailedDescription = gameObject.getAsJsonPrimitive("detailed_description").getAsString();
            game.setDetailedDescription(detailedDescription);
        } catch (Exception exception) {
            game.setDetailedDescription("");
            log.error("Error during convert ID:{} game fieldDETAILED DESC{}", steamAppId, exception.getMessage());
        }

        try {
            String aboutTheGame = gameObject.getAsJsonPrimitive("about_the_game").getAsString();
            game.setAboutTheGame(aboutTheGame);
        } catch (Exception exception) {
            game.setAboutTheGame("");
            log.error("Error during convert ID:{} game field ABOUT THE GAME{}", steamAppId, exception.getMessage());
        }

        try {
            String shortDescription = gameObject.getAsJsonPrimitive("short_description").getAsString();
            game.setShortDescription(shortDescription);
        } catch (Exception exception) {
            game.setShortDescription("");
            log.error("Error during convert ID:{} game field SHORT DESC{}", steamAppId, exception.getMessage());
        }

        try {
            String supportedLanguages = gameObject.getAsJsonPrimitive("supported_languages").getAsString();
            game.setSupportedLanguages(supportedLanguages);
        } catch (Exception exception) {
            game.setSupportedLanguages("");
            log.error("Error during convert ID:{} game field SUPPORTED LANGUAGES{}", steamAppId, exception.getMessage());
        }
        try {
            String headerImage = gameObject.getAsJsonPrimitive("header_image").getAsString();
            game.setHeaderImage(headerImage);
        } catch (Exception exception) {
            game.setHeaderImage("");
            log.error("Error during convert ID:{} game field HEADER IMG{}", steamAppId, exception.getMessage());
        }

        try {
            String website = gameObject.getAsJsonPrimitive("website").getAsString();
            game.setWebsite(website);
        } catch (Exception exception) {
            game.setWebsite("");
        }

        try {
            List<JsonElement> developersJsonElementList = gameObject.getAsJsonArray("developers").asList();
            List<String> developers = new ArrayList<>();
            developersJsonElementList.forEach(developer -> {
                developers.add(developer.getAsString());
            });
            game.setDevelopers(developers);
        } catch (Exception exception) {
            game.setDevelopers(new ArrayList<>());
            log.error("Error during convert ID:{} game field DEVELOPERS {}", steamAppId, exception.getMessage());
        }

        try {
            List<JsonElement> publishersJsonElementList = gameObject.getAsJsonArray("publishers").asList();
            List<String> publishers = new ArrayList<>();
            publishersJsonElementList.forEach(developer -> {
                publishers.add(developer.getAsString());
            });
            game.setPublishers(publishers);
        } catch (Exception exception) {
            game.setPublishers(new ArrayList<>());
            log.error("Error during convert ID:{} game field PUBLISHERS {}", steamAppId, exception.getMessage());
        }

        try {
            JsonObject platformsJsonObject = gameObject.getAsJsonObject("platforms");
            Boolean isRunningOnWindows = platformsJsonObject.getAsJsonPrimitive("windows").getAsBoolean();
            Boolean isRunningOnMac = platformsJsonObject.getAsJsonPrimitive("mac").getAsBoolean();
            Boolean isRunningOnLinux = platformsJsonObject.getAsJsonPrimitive("linux").getAsBoolean();
            List<String> platforms = new ArrayList<>();
            if (isRunningOnWindows) {
                platforms.add("Windows");
            }
            if (isRunningOnMac) {
                platforms.add("Mac");
            }
            if (isRunningOnLinux) {
                platforms.add("Linux");
            }
            game.setPlatforms(platforms);
        } catch (Exception exception) {
            game.setPlatforms(new ArrayList<>());
            log.error("Error during convert ID:{} game field PLATFORMS {}", steamAppId, exception.getMessage());
        }

        try {
            JsonArray genresJsonArray = gameObject.getAsJsonArray("genres");
            List<String> genres = new ArrayList<>();
            genresJsonArray.forEach(genre -> {
                genres.add(genre.getAsJsonObject().get("description").getAsString());
            });
            game.setGenres(genres);
        } catch (Exception exception) {
            game.setGenres(new ArrayList<>());
            log.error("Error during convert ID:{} game field GENRES {}", steamAppId, exception.getMessage());
        }

        try {
            JsonArray screenshotJsonArray = gameObject.getAsJsonArray("screenshots");
            List<String> screenshots = new ArrayList<>();
            Integer maxPiecesScreenshot = Math.min(screenshotJsonArray.size(), 15);
            for (int i = 0; i < maxPiecesScreenshot; i++) {
                screenshots.add(screenshotJsonArray.get(i).getAsJsonObject().get("path_full").getAsString());
            }
            game.setScreenshots(screenshots);
        } catch (Exception exception) {
            game.setScreenshots(new ArrayList<>());
            log.error("Error during convert ID:{} game field SCREENSHOTS {}", steamAppId, exception.getMessage());
        }

        try {
            JsonArray movieJsonArray = gameObject.getAsJsonArray("movies");
            List<String> movies = new ArrayList<>();
            Integer maxPiecesScreenshot = Math.min(movieJsonArray.size(), 15);
            for (int i = 0; i < maxPiecesScreenshot; i++) {
                movies.add(movieJsonArray.get(i).getAsJsonObject().get("webm").getAsJsonObject().get("max").getAsString());
            }
            game.setMovies(movies);
        } catch (Exception exception) {
            game.setMovies(new ArrayList<>());
            log.error("Error during convert ID:{} game field MOVIES {}", steamAppId, exception.getMessage());
        }

        try {
            JsonObject releaseDateObject = gameObject.getAsJsonObject("release_date");
            Map<String, Object> releaseDate = new HashMap<>();
            releaseDate.put("comingSoon", releaseDateObject.getAsJsonPrimitive("coming_soon").getAsBoolean());
            releaseDate.put("date", releaseDateObject.getAsJsonPrimitive("date").getAsString());
            game.setReleaseDate(releaseDate);
        } catch (Exception exception) {
            game.setReleaseDate(new HashMap<>());
            log.error("Error during convert ID:{} game field RELEASE DATE {}", steamAppId, exception.getMessage());
        }

        try {
            JsonObject priceJsonObject = gameObject.getAsJsonObject("price_overview");
            String priceString = priceJsonObject.getAsJsonPrimitive("final_formatted").getAsString();
            Double price = 0.0;
            if (priceString.contains(",")) {
                priceString = priceString.replace(",", ".");
                priceString = priceString.replace("€", "");
                price = Double.parseDouble(priceString);
            }
            game.setPrice(price);
        } catch (Exception exception) {
            game.setPrice(0.0);
            if (!game.getIsFree() && game.getReleaseDate().get("coming_soon").equals(false)) {
                log.error("Error during convert ID:{} game field PRICE {}", steamAppId, exception.getMessage());
            }
        }

        try {
            String background = gameObject.getAsJsonPrimitive("background").getAsString();
            game.setBackground(background);
        } catch (Exception exception) {
            game.setBackground("");
            log.error("Error during convert ID:{} game field BACKGROUND{}", steamAppId, exception.getMessage());
        }

        try {
            String backgroundRaw = gameObject.getAsJsonPrimitive("background_raw").getAsString();
            game.setBackgroundRaw(backgroundRaw);
        } catch (Exception exception) {
            game.setBackgroundRaw("");
            log.error("Error during convert ID:{} game field BACKGROUND RAW{}", steamAppId, exception.getMessage());
        }

        game.setIsAdult(false);
        game.setUsers(new ArrayList<>());
        game.setWishlistUsers(new ArrayList<>());

        return game;
    }

    private boolean isAdultGame(Game game) {
        List<FilterAdult> allFilterAdult = adultRepository.getAllWords();
        List<String> onlyWords = allFilterAdult.stream().map(FilterAdult::getWord).collect(Collectors.toList());
        for (int i = 0; i < onlyWords.size(); i++) {
            String adultWord = onlyWords.get(i);
            if (game.getName().contains(adultWord) || game.getDetailedDescription().contains(adultWord) || game.getAboutTheGame().contains(adultWord) || game.getShortDescription().contains(adultWord)) {
                log.warn("Adult because: {} word was found in ID: {}", adultWord, game.getSteamAppId());
                return true;
            }
        }
        return false;
    }
}
