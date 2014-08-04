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