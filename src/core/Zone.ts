/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

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