export enum STRINGS {
    SERVER_URL = "https://gombino.ddns.net:8443/",
    WEB_SOCKET = "wss://gombino.ddns.net:8443/ws-server",

    API_LOGIN = "api/login",
    API_REGISTRATION = "api/registration",

    API_NOTES = "api/notes/",
    API_ADD_OR_REMOVE_NOTE_TO_USER_FAV_LIST = "api/notes/change-favorite-state/",
    API_NOTES_CHANGE_VISIBILITY = "api/notes/change-visibility/",

    API_PROFILE = "api/profile/",
    API_PROFILE_CHANGE_PASSWORD = "api/profile/change-password/",

    API_GAMES = "api/games/",


}

export enum FIXED_SIZES {
    // The mobile menu height current is 3 rem (1rem == 16px)
    MOBILE_MENU_HEIGHT_FROM_BOTTOM = 50
}