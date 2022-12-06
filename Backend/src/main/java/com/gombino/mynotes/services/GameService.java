package com.gombino.mynotes.services;

import com.gombino.mynotes.models.dto.PaginationSorterDto;

import java.util.Map;

public interface GameService {

    Map<String, Object> findAllGame(PaginationSorterDto paginationSorterDto);
}
