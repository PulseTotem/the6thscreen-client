/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Call.ts" />
/// <reference path="../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../t6s-core/core-client/scripts/behaviour/Behaviour.ts" />

declare var io: any; // Use of Socket.IO lib
declare var $: any; // Use of JQuery

/**
 * Represents a Zone of The6thScreen Client.
 *
 * @class Zone
 */
class Zone {

    /**
     * Zone's id.
     *
     * @property _id
     * @type number
     */
    private _id : number;

    /**
     * Zone's name.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Zone's description.
     *
     * @property _description
     * @type string
     */
    private _description : string;

    /**
     * Zone's width.
     *
     * @property _width
     * @type number
     */
    private _width : number;

    /**
     * Zone's height.
     *
     * @property _height
     * @type number
     */
    private _height : number;

    /**
     * Zone's positionFromTop.
     *
     * @property _positionFromTop
     * @type number
     */
    private _positionFromTop : number;

    /**
     * Zone's positionFromLeft.
     *
     * @property _positionFromLeft
     * @type number
     */
    private _positionFromLeft : number;

    /**
     * List of Calls' Zone
     *
     * @property _calls
     * @type Array<Call>
     */
    private _calls : Array<Call>;

    /**
     * Behaviour attached to Zone.
     *
     * @property _behaviour
     * @type Behaviour
     */
    private _behaviour : Behaviour;

    /**
     * Zone Div.
     *
     * @property _zoneDiv
     * @type DOM Element
     */
    private _zoneDiv : any;


    /**
     * Constructor.
     *
     * @constructor
     * @param {number} id - The Zone's id.
     * @param {string} name - The Zone's name.
     * @param {string} description - The Zone's description.
     * @param {number} width - The Zone's width.
     * @param {number} height - The Zone's height.
     * @param {number} positionFromTop - The Zone's positionFromTop.
     * @param {number} positionFromLeft - The Zone's positionFromLeft.
     */
    constructor(id: number, name : string, description: string, width: number, height: number, positionFromTop: number, positionFromLeft: number) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._width = width;
        this._height = height;
        this._positionFromTop = positionFromTop;
        this._positionFromLeft = positionFromLeft;
        this._calls = new Array<Call>();
        this._behaviour = null;
        this._attachToDom();
    }

    /**
     * Returns Zone's Id.
     *
     * @method getId
     * @return {number} The zone's Id.
     */
    getId() : number {
        return this._id;
    }

    /**
     * Returns Zone's Calls.
     *
     * @method getCalls
     * @return {Array<Call>} The zone's calls.
     */
    getCalls() : Array<Call> {
        return this._calls;
    }

    /**
     * Returns Zone's SourceServer socket.
     *
     * @method getSourcesServerSocket
     * @return {any} The zone's SourcesServer socket.
     * /
    getSourcesServerSocket() {
        return this._sourcesServerSocket;
    }
    */

    /**
     * Add Call to Zone.
     *
     * @method addCall
     * @param {Call} call - The Call to add.
     */
    addCall(call : Call) {
        this._calls.push(call);
        this.restartBehaviour();
    }

    /**
     * Set the Zone's behaviour..
     *
     * @method setBehaviour
     * @param {Behaviour} behaviour - The Behaviour to set.
     */
    setBehaviour(behaviour : Behaviour) {
        this._behaviour = behaviour;
        this._behaviour.setZoneDiv(this._zoneDiv);
        this.restartBehaviour();
    }

    /**
     * Restart the Behaviour.
     *
     * @method restartBehaviour
     */
    restartBehaviour() {
        if(this._behaviour != null) {
            this._behaviour.restart(this._calls);
        }
    }

    /**
     * Stop the Behaviour.
     *
     * @method stopBehaviour
     */
    stopBehaviour() {
        if(this._behaviour != null) {
            this._behaviour.stop();
        }
    }

    /**
     * Refresh the Behaviour.
     *
     * @method refreshBehaviour
     */
    refreshBehaviour() {
        if(this._behaviour != null) {
            this._behaviour.buildListMapInfoRenderer(this._calls);
        }
    }

    /**
     * Return a Call from CallId.
     *
     * @method retrieveCall
     * @param {number} callId - The Call's Id.
     */
    retrieveCall(callId : number) {
        for(var iCall in this._calls) {
            var call = this._calls[iCall];
            if(call.getId() == callId) {
                return call;
            }
        }

        return null;
    }

    /**
     * Attach Zone to Client's DOM.
     *
     * @method _attachToDom
     * @private
     */
    private _attachToDom() {
        this._zoneDiv = $("<div>");
        this._zoneDiv.addClass("zone");
        this._zoneDiv.css("top", this._positionFromTop + "%");
        this._zoneDiv.css("left", this._positionFromLeft + "%");
        this._zoneDiv.css("width", this._width + "%");
        this._zoneDiv.css("height", this._height + "%");


        $("#the6thscreen-client-content").append(this._zoneDiv);
    }
}