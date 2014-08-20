/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Info.ts" />
/// <reference path="./Picture.ts" />

class PictureAlbum extends Info {
    private _pictures : Array<Picture>;

    constructor() {
        super();
        this._pictures = new Array<Picture>();
    }

    addPicture(pic : Picture) {
        this._pictures.push(pic);
    }
}