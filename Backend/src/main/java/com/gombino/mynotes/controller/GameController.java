package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.dto.GameSearchDto;
import com.gombino.mynotes.models.dto.PaginationSorterDto;
import com.gombino.mynotes.services.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@Tag(name = "GameController", description = "Manages games")
public class GameController {
    private final GameService gameService;

    @Operation(description = "List all games")
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> getAllGame(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "1") int size,
            @RequestParam(name = "sortBy", defaultValue = "") String sortBy) {
        PaginationSorterDto paginationSorterDto = new PaginationSorterDto(page, size, sortBy);
        return ResponseEntity.status(HttpStatus.OK).body(gameService.findAllGame(paginationSorterDto));
    }

    @Operation(description = "List all games with filter")
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> getAllGameWithFilter(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "1") int size,
            @RequestParam(name = "userId", required = false) String userId,
            @RequestBody GameSearchDto gameSearchDto) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.findAllGameWithFilter(page, size, gameSearchDto, userId));
    }

    @Operation(description = "Get all Genre")
    @GetMapping("/genres-languages-categories")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> getGenres() {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.getGenresAndLanguagesAndCategories());
    }

    @Operation(description = "Get game by ID")
    @GetMapping("/game/{gameId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> getGameById(@PathVariable String gameId) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.findGameById(gameId));
    }

    @Operation(description = "Check the user is own or wishlisted this game")
    @GetMapping("/check-wishlist-or-owner/{gameId}/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> isUserOwnOrWishlistedGame(@PathVariable String gameId, @PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.isUserOwnOrWishlistedGame(gameId, userId));
    }

    @Operation(description = "Add a game to user wishlist")
    @PostMapping("/add-to-wishlist/{gameId}/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> addGameToUserWishlist(@PathVariable String gameId, @PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.addGameToUserWishlist(gameId, userId));
    }

    @Operation(description = "Remove a game from user wishlist")
    @DeleteMapping("/remove-from-wishlist/{gameId}/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> removeGameFromUserWishlist(@PathVariable String gameId, @PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.removeGameFromUserWishlist(gameId, userId));
    }

    @Operation(description = "Purchase a game")
    @PostMapping("/purchase-games/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> purchaseGames(@RequestBody List<String> gameIds, @PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.purchaseGames(gameIds, userId));
    }

    @Operation(description = "Remove a game from the DB")
    @DeleteMapping("/remove-game/{gameId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> removeGameFromDbById(@PathVariable String gameId) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.removeGameFromDbById(gameId));
    }

    @Operation(description = "Remove a game from the DB")
    @PutMapping("/change-game-adult-status/{gameId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> changeGameAdultStatus(@PathVariable String gameId, @RequestParam Boolean isAdult) {
        return ResponseEntity.status(HttpStatus.OK).body(gameService.changeGameAdultStatus(isAdult, gameId));
    }

}
