package com.gombino.mynotes.controller;

import com.gombino.mynotes.models.dto.PaginationSorterDto;
import com.gombino.mynotes.services.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
@Slf4j
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


}
