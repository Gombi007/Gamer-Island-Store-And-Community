export class PagInfo {
    private actualPage: number;
    private totalPages: number;
    private totalElements: number;


    constructor($actualPage: number, $totalPages: number, $totalElements: number) {
        this.actualPage = $actualPage;
        this.totalPages = $totalPages;
        this.totalElements = $totalElements;
    }


    /**
     * Getter $actualPage
     * @return {number}
     */
    public get $actualPage(): number {
        return this.actualPage;
    }

    /**
     * Getter $totalPages
     * @return {number}
     */
    public get $totalPages(): number {
        return this.totalPages;
    }

    /**
     * Getter $totalElements
     * @return {number}
     */
    public get $totalElements(): number {
        return this.totalElements;
    }

    /**
     * Setter $actualPage
     * @param {number} value
     */
    public set $actualPage(value: number) {
        this.actualPage = value;
    }

    /**
     * Setter $totalPages
     * @param {number} value
     */
    public set $totalPages(value: number) {
        this.totalPages = value;
    }

    /**
     * Setter $totalElements
     * @param {number} value
     */
    public set $totalElements(value: number) {
        this.totalElements = value;
    }

}