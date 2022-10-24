export class noteDto {
    id: string = "";
    title: string = "";
    text: string = "";
    isUrgent: boolean = false;
    created: string = "";
    lastModified: string = "";
    imgUrl: string = "";
}

export class noteDtoToPost {
    title: string | null = null;
    text: string | null = null;
    isUrgent: boolean | null = null;
    imgUrl: string | null = null;

    constructor(title: string | null = null,
        text: string | null = null,
        isUrgent: boolean | null = null,
        imgUrl: string | null = null) {

        this.title = title;
        this.text = text;
        this.isUrgent = isUrgent;
        this.imgUrl = imgUrl;;
    }
}