export class noteDto {
    id: string = "";
    text: string = "";
    text2: string = "";
    isUrgent: boolean = false;
    created: string = "";
    lastModified: string = "";
    imgUrl: string = "";
}

export class noteDtoToPost {
    text: string | null = null;
    text2: string | null = null;
    isUrgent: boolean | null = null;
    imgUrl: string | null = null;

    constructor(text: string | null = null,
        text2: string | null = null,
        isUrgent: boolean | null = null,
        imgUrl: string | null = null) {

        this.text = text;
        this.text2 = text2;
        this.isUrgent = isUrgent;
        this.imgUrl = imgUrl;;
    }
}