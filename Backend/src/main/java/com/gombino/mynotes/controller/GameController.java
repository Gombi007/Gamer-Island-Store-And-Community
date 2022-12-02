package com.gombino.mynotes.controller;

import com.gombino.mynotes.services.GameService;
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
@RequestMapping("/api/games")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "GameController", description = "Manages games")
public class GameController {
    private final GameService gameService;
    private final SteamApiService steamApiService;

    @Operation(description = "List all games")
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> getAllGame() {
        steamApiService.saveAllSteamProductsInTheDB();
        return ResponseEntity.status(HttpStatus.OK).body(gameService.findAllGame());
    }


}
