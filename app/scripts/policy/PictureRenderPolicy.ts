/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./RenderPolicy.ts" />
/// <reference path="../info/Picture.ts" />

class PictureRenderPolicy implements RenderPolicy<Picture> {
    process(listInfos : Array<Picture>) : Array<Picture> {
        return listInfos;
    }
}