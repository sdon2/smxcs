import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor() {
    }

    post(obj,url) {
        var mapForm = document.createElement("form");
        mapForm.target = "_blank";
        mapForm.method = "POST"; // or "post" if appropriate
        mapForm.action = url;
        var mapInput = document.createElement("input");
        mapInput.type = "hidden";
        mapInput.name = "data";
        mapInput.setAttribute("value", JSON.stringify(obj));
        mapForm.appendChild(mapInput);
        document.body.appendChild(mapForm);
        mapForm.submit();
        document.body.removeChild(mapForm);
    }
}
