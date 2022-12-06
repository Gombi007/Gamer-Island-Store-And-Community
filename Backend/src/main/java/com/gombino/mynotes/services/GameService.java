package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.GameDto;
import com.gombino.mynotes.models.dto.PaginationSorterDto;

import java.util.Map;

public interface GameService {

    Map<String, Object> findAllGame(PaginationSorterDto paginationSorterDto);

    GameDto findGameById(String gameId);

    Map<String, Boolean> isUserOwnOrWishlistedGame(String gameId, String userId);

    String addGameToUserWishlist(String gameId, String userId);

    String removeGameFromUserWishlist(String gameId, String userId);
}
