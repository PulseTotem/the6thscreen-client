/// <reference path="../info/PictureAlbum.ts" />
/// <reference path="./Renderer.ts" />

class PictureAlbumRenderer implements Renderer<PictureAlbum> {
    transformForBehaviour<Picture>(listInfos : Array<Picture>, renderPolicy : PictureRenderPolicy) : Array<PictureAlbum> {
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