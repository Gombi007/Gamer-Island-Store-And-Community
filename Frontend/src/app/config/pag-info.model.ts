export class PagInfo {
    actualPage: number;
    totalPages: number;
    totalElements: number;


    constructor($actualPage: number, $totalPages: number, $totalElements: number) {
        this.actualPage = $actualPage;
        this.totalPages = $totalPages;
        this.totalElements = $totalElements;
    }
}