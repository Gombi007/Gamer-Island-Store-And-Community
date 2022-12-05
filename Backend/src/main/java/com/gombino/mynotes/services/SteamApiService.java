package com.gombino.mynotes.services;

import java.util.List;

public interface SteamApiService {

    void saveAllSteamProductsInTheDB();

    List<String> getSteamGames(Integer page, Integer size);

}
