/// <reference path="../info/PictureAlbum.ts" />
/// <reference path="./Renderer.ts" />

class PictureAlbumRenderer extends Renderer<PictureAlbum> {
    static transformForBehaviour<Picture>(listInfos : Array<Picture>, renderPolicy : RenderPolicy<Picture>) : Array<PictureAlbum> {
        return renderPolicy.process(listInfos); // Ca râle!
    }

    static render(info : PictureAlbum, domElem : any) {

    }
}