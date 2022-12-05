package com.gombino.mynotes.controller;

import com.gombino.mynotes.services.SteamApiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/steam")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Steam API controller", description = "Manages steam api and save game in the DB")
public class SteamApiController {
    private final SteamApiService steamApiService;

    @Operation(description = "Refresh All Steam product in the DB")
    @GetMapping("update-all-steam-products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> refreshAllSteamProducts() {
        steamApiService.saveAllSteamProductsInTheDB();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Operation(description = "Save games in the DB")
    @GetMapping("save-games")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> saveGames() {
        return ResponseEntity.status(HttpStatus.OK).body(steamApiService.getSteamGames(0, 50));
    }


}
