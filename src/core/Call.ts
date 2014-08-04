/// <reference path="../policy/ReceivePolicy.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="../renderer/Renderer.ts" />
/// <reference path="../info/Info.ts" />

class Call {
    private _id : string;
    private _host : string;
    private _port : string;
    private _receivePolicy : ReceivePolicy;
    private _renderer : Renderer<any>;
    private _renderPolicy : RenderPolicy<any>;
    private _listInfos : Array<Info>;

    constructor() {

    }

    getListInfos() : Array<Info> {
        return this._listInfos;
    }

    getRenderer() : Renderer<any> {
        return this._renderer;
    }

    getRenderPolicy() : RenderPolicy<any> {
        return this._renderPolicy;
    }
}