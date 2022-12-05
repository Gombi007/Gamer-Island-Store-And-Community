package com.gombino.mynotes.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum StaticStings {

    STEAM_GAME_DETAILS_URL("https://store.steampowered.com/api/appdetails/?appids="),
    STEAM_ALL_PRODUCTS_URL("https://api.steampowered.com/ISteamApps/GetAppList/v2/");

    private String url;
}
