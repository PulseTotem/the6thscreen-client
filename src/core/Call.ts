/// <reference path="../policy/ReceivePolicy.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="../renderer/Renderer.ts" />
/// <reference path="../info/Info.ts" />

class Call {
    private _id : string;
    private _host : string;
    private _port : string;
    private _receivePolicy : ReceivePolicy;
    private _renderer : Renderer;
    private _renderPolicy : RenderPolicy;
    private _listInfos : Array<Info>;

    constructor() {

    }

    getListInfos() : Array<Info> {
        return this._listInfos;
    }

    getRenderer() {
        return this._renderer;
    }

    getRenderPolicy() : RenderPolicy {
        return this._renderPolicy;
    }
}