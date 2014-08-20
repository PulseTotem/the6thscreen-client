/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../info/Info.ts" />
/// <reference path="../renderer/Renderer.ts" />

class MapInfoRenderer<T extends Info> {
    info : T;
    renderer : Renderer<T>;

    constructor(info : T, renderer : Renderer<T>) {
        this.info = info;
        this.renderer = renderer;
    }
}