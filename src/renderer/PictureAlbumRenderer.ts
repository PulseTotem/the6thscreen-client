/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../info/PictureAlbum.ts" />
/// <reference path="../info/Picture.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="./Renderer.ts" />

class PictureAlbumRenderer implements Renderer<PictureAlbum> {
    transformForBehaviour(listInfos : Array<Picture>, renderPolicy : RenderPolicy<Picture>) : Array<PictureAlbum> {
        var listPicture = renderPolicy.process(listInfos);
        var result = new PictureAlbum();
        listPicture.forEach(function(pic) {
            result.addPicture(pic);
        });

        return new Array(result);
    }

    render(info : PictureAlbum, domElem : any) {

    }
}