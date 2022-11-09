export class PagQuerry {
    private page: number = 0;
    private size: number = 0;
    private sortBy: string = "";


    constructor($page: number, $size: number, $sortBy: string) {
        this.page = $page;
        this.size = $size;
        this.sortBy = $sortBy;
    }

    /**
     * Getter $page
     * @return {number }
     */
    public get $page(): number {
        return this.page;
    }

    /**
     * Getter $size
     * @return {number }
     */
    public get $size(): number {
        return this.size;
    }

    /**
     * Getter $sortBy
     * @return {string }
     */
    public get $sortBy(): string {
        return this.sortBy;
    }

    /**
     * Setter $page
     * @param {number } value
     */
    public set $page(value: number) {
        this.page = value;
    }

    /**
     * Setter $size
     * @param {number } value
     */
    public set $size(value: number) {
        this.size = value;
    }

    /**
     * Setter $sortBy
     * @param {string } value
     */
    public set $sortBy(value: string) {
        this.sortBy = value;
    }


}




