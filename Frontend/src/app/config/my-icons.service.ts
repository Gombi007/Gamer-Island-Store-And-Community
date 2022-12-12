import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
    providedIn: 'root'
})

export class MyIconsService {

    constructor(private sanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) { }

    addMyIconsToMaterial(iconObject: { 'name': string, 'path': string }[]) {
        if (iconObject.length > 0) {
            for (let index = 0; index < iconObject.length; index++) {
                this.matIconRegistry.addSvgIcon(
                    iconObject[index].name,
                    this.sanitizer.bypassSecurityTrustResourceUrl(iconObject[index].path)

                );
            }
        }
    }
}