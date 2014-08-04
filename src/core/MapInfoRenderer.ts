/// <reference path="../info/Info.ts" />
/// <reference path="../renderer/Renderer.ts" />

class MapInfoRenderer<T extends Info> {
    info : T;
    renderer : Renderer;

    constructor(info : T, renderer : Renderer) {
        this.info = info;
        this.renderer = renderer;
    }
}