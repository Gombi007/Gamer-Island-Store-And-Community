export class UserModifyByAdminDto {
    id: string = "";
    username: string = "";
    email: string = "";
    avatar: string = "";
    lastLogin: String = "";
    created: String = "";
    isDisabled: boolean = false;
    roles: string[] = [];
    noteIds: string[] = [];
    favoriteNotesIds: string[] = [];
    wishlistGames: string[] = [];
    ownedGames: string[] = [];
}

