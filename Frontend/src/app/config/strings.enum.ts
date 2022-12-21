export enum STRINGS {
    SERVER_URL = "http://localhost:8081/",
    WEB_SOCKET = "ws://localhost:8081/ws-server",

    API_LOGIN = "api/login",
    API_REGISTRATION = "api/registration",
    API_HAS_ROLE_ADMIN = "api/roles/has-role-admin/",

    API_NOTES = "api/notes/",
    API_ADD_OR_REMOVE_NOTE_TO_USER_FAV_LIST = "api/notes/change-favorite-state/",
    API_NOTES_CHANGE_VISIBILITY = "api/notes/change-visibility/",

    API_PROFILE = "api/profile/",
    API_PROFILE_CHANGE_PASSWORD = "api/profile/change-password/",

    API_GAMES = "api/games/",
    API_GAMES_LANGUAGES_GENRES_CATEGORIES = "genres-languages-categories",

    API_ADMIN_SAVE_GAMES = "api/steam/save-games"
}

export enum FIXED_SIZES {
    // The mobile menu height current is 3 rem (1rem == 16px)
    MOBILE_MENU_HEIGHT_FROM_BOTTOM = 50
}