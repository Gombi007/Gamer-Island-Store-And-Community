package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.GameDto;
import com.gombino.mynotes.models.dto.PaginationInfo;
import com.gombino.mynotes.models.dto.PaginationSorterDto;
import com.gombino.mynotes.models.entities.Game;
import com.gombino.mynotes.models.entities.User;
import com.gombino.mynotes.repositories.GameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    public Map<String, Object> findAllGame(PaginationSorterDto paginationSorterDto) {
        Pageable paging = PageRequest.of(paginationSorterDto.getPage(), paginationSorterDto.getSize(), Sort.by(paginationSorterDto.getSortBy()).ascending());
        Page<Game> gamePage = gameRepository.findAll(paging);
        List<GameDto> gameList = new ArrayList<>();
        for (Game game : gamePage) {
            gameList.add(convertToGameDto(game));
        }
        PaginationInfo paginationInfo = new PaginationInfo(gamePage.getNumber(), gamePage.getTotalPages(), gamePage.getTotalElements());
        Map<String, Object> map = new HashMap<>();
        map.put("page", gameList);
        map.put("paginationInfo", paginationInfo);
        return map;
    }

    @Override
    public GameDto findGameById(String gameId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new NoSuchElementException("There is no game with this ID"));
        return convertToGameDto(game);
    }

    @Override
    public Map<String, Boolean> isUserOwnOrWishlistedGame(String gameId, String userId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new NoSuchElementException("There is no game with this ID"));
        User user = userService.getUserById(userId);
        Boolean isOwner = game.getUsers().contains(user.getId());
        Boolean isOnWishlist = game.getWishlistUsers().contains(user.getId());
        Map<String, Boolean> result = new HashMap<>();
        result.put("owner", isOwner);
        result.put("wishlist", isOnWishlist);
        return result;
    }

    @Override
    public String addGameToUserWishlist(String gameId, String userId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new NoSuchElementException("There is no game with this ID"));
        User user = userService.getUserById(userId);
        Boolean isOnWishlist = game.getWishlistUsers().contains(user.getId());
        Boolean isOwner = game.getUsers().contains(user.getId());
        if (!isOnWishlist && !isOwner) {
            game.getWishlistUsers().add(user.getId());
            user.getWishlistGames().add(game.getId());
            gameRepository.save(game);
            userService.updateUser(user);
            return "'" + game.getName() + "'" + " was added to your wishlist";
        }
        if (isOnWishlist) {
            return "'" + game.getName() + "'" + " is already on your wishlist";
        }
        if (isOwner) {
            return "'" + game.getName() + "'" + " is already owned";
        }
        return null;
    }

    @Override
    public String removeGameFromUserWishlist(String gameId, String userId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new NoSuchElementException("There is no game with this ID"));
        User user = userService.getUserById(userId);
        Boolean isOnWishlist = game.getWishlistUsers().contains(user.getId());
        if (isOnWishlist) {
            game.getWishlistUsers().remove(user.getId());
            user.getWishlistGames().remove(game.getId());
            gameRepository.save(game);
            userService.updateUser(user);
            return "'" + game.getName() + "'" + " was removed from your wishlist";
        }
        return "'" + game.getName() + "'" + " is not on your wishlist";
    }

    @Override
    public String purchaseGames(List<String> gameIds, String userId) {
        User user = userService.getUserById(userId);
        Set<Game> gameList = new HashSet<>();
        Double priceOfAllGames = 0.0;

        for (String id : gameIds) {
            Game game = gameRepository.findById(id).orElseThrow(() -> new NoSuchElementException("There is no game with this ID"));
            if (!user.getOwnedGames().contains(game.getId())) {
                gameList.add(game);
                priceOfAllGames += game.getPrice();
            }
        }

        if (user.getBalance() < priceOfAllGames) {
            return "Sorry, Not enough money to purchase";
        }

        if (gameList.size() == 0) {
            return "You already own all games from cart";
        }

        if (user.getBalance() >= priceOfAllGames) {
            for (Game game : gameList) {
                user.getOwnedGames().add(game.getId());
                game.getUsers().add(user.getId());
                game.getWishlistUsers().remove(user.getId());
                gameRepository.save(game);
                user.setBalance(user.getBalance() - game.getPrice());
                user.getWishlistGames().remove(game.getId());
                userService.updateUser(user);
            }
            return "Your purchase was successful, Thanks for the purchase";
        }
        return null;
    }

    @Override
    public String removeGameFromDbById(String gameId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new NoSuchElementException("There is no game with this ID"));
        List<String> wishlistUsers = game.getWishlistUsers();
        List<String> ownerUsers = game.getUsers();

        for (String userId : wishlistUsers) {
            User user = userService.getUserById(userId);
            user.getWishlistGames().remove(game.getId());
            userService.updateUser(user);
        }

        for (String userId : ownerUsers) {
            User user = userService.getUserById(userId);
            user.getOwnedGames().remove(game.getId());
            userService.updateUser(user);
        }
        gameRepository.delete(game);

        return "Game was removed";
    }

    private GameDto convertToGameDto(Game game) {
        return modelMapper.map(game, GameDto.class);
    }
}
