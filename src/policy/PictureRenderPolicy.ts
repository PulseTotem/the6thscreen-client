/// <reference path="./RenderPolicy.ts" />
/// <reference path="../info/Picture.ts" />

class PictureRenderPolicy implements RenderPolicy<Picture> {
    process(listInfos : Array<Picture>) : Array<Picture> {
        return listInfos;
    }
}