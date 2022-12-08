package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.GameDto;
import com.gombino.mynotes.models.dto.GameSearchDto;
import com.gombino.mynotes.models.dto.PaginationSorterDto;

import java.util.List;
import java.util.Map;

public interface GameService {

    Map<String, Object> findAllGame(PaginationSorterDto paginationSorterDto);

    Map<String, Object> findAllGameWithFilter(Integer page, Integer size, GameSearchDto gameSearchDto);

    GameDto findGameById(String gameId);


    Map<String, Boolean> isUserOwnOrWishlistedGame(String gameId, String userId);

    String addGameToUserWishlist(String gameId, String userId);

    String removeGameFromUserWishlist(String gameId, String userId);

    String purchaseGames(List<String> gameIds, String userId);

    String removeGameFromDbById(String gameId);


}
