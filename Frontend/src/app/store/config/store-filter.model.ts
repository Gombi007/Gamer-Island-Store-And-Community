export class storeFilter {
    searchText: string = "";
    sortByField: string = "";
    isAscending: boolean = true;
    languages: string[] = [];
    genres: string[] = [];
    opSystems: string[] = [];
    categories: string[] = [];
    isHideFreeGames: boolean = false;
    isHideAdultGames: boolean = true;
    showOnlyAdultGames: boolean = false;
    isHideMyOwnGames: boolean = false;
    isHideMyWishlistGames: boolean = false;
    price: number = 100;

    public constructor(init?: Partial<storeFilter>) {
        Object.assign(this, init);
    }
}

