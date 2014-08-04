/// <reference path="../core/MapInfoRenderer.ts" />

class Behaviour {
    private _listMapInfoRenderer : Array<MapInfoRenderer>;

    constructor() {
        this._listMapInfoRenderer = new Array<MapInfoRenderer>();
    }

    buildListMapInfoRenderer(calls : Array<Call>) {
        var self = this;

        calls.forEach(function(call) {
            var listInfos = call.getListInfos();
            var renderer = call.getRenderer();
            var renderPolicy = call.getRenderPolicy();

            var processedList = renderer.transformForBehaviour(listInfos, renderPolicy);

            processedList.forEach(function(info) {
                self._listMapInfoRenderer.push(new MapInfoRenderer(info, renderer));
            });
        });
    }
}