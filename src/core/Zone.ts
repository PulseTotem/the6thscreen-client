/// <reference path="./Call.ts" />
/// <reference path="../behaviour/Behaviour.ts" />

class Zone {
    private _calls : Array<Call>;
    private _behaviour : Behaviour;

    constructor() {
        this._calls = new Array<Call>();
        this._behaviour = new Behaviour();
    }
}