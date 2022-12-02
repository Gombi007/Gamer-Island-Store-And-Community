package com.gombino.mynotes.services;

import com.gombino.mynotes.enums.StaticStings;
import com.gombino.mynotes.models.entities.SteamProduct;
import com.gombino.mynotes.repositories.SteamProductRepository;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SteamApiServiceImpl implements SteamApiService {
    private final SteamProductRepository steamProductRepository;

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
                SteamProduct steamProduct = new SteamProduct(Instant.now(), app.get("appid").getAsLong(), app.get("name").getAsString());
                steamProducts.add(steamProduct);
            }
            steamProductRepository.deleteAll();
            steamProductRepository.saveAll(steamProducts);
            log.warn("All steam products was saved in the db");

        } catch (Exception exception) {
            log.warn("The Steam API is not available");
        }

    }
}
