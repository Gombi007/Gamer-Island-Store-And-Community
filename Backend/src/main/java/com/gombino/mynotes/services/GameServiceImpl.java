package com.gombino.mynotes.services;

import com.gombino.mynotes.models.entities.Game;
import com.gombino.mynotes.repositories.GameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;

    @Override
    public Map<String, Object> findAllGame() {
        Pageable paging = PageRequest.of(0, 600, Sort.by("name").ascending());
        Page<Game> gamePage = gameRepository.findAll(paging);
        List<Game> gameList = new ArrayList<>();
        for (Game game : gamePage) {
            gameList.add(game);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result", gameList);
        return map;
    }
}
