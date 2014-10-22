/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Call.ts" />
/// <reference path="../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../t6s-core/core-client/scripts/behaviour/Behaviour.ts" />

declare var io: any; // Use of Socket.IO lib

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
     * The 6th Screen Sources Server's URL.
     *
     * @property _sourcesServerURL
     * @type string
     */
    private _sourcesServerURL : string = "http://localhost:5000/";

    /**
     * The 6th Screen Sources Server's socket.
     *
     * @property _sourcesServerSocket
     * @type any
     */
    private _sourcesServerSocket : any;

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
        this._behaviour = new Behaviour();
        this._sourcesServerSocket = this._connectToSourcesServer(this._sourcesServerURL);
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
     * Returns Zone's SourceServer socket.
     *
     * @method getSourcesServerSocket
     * @return {any} The zone's SourcesServer socket.
     */
    getSourcesServerSocket() {
        return this._sourcesServerSocket;
    }

    /**
     * Add Call to Zone.
     *
     * @method addCall
     * @param {Call} call - The Call to add.
     */
    addCall(call : Call) {
        this._calls.push(call);
    }

    /**
     * Connect to The6thScreen Sources' Server.
     *
     * @method _connectToSourcesServer
     * @private
     * @param {string} sourcesServerURL - The Sources Server's URL.
     */
    private _connectToSourcesServer(sourcesServerURL : string) {
        try {
            var sourcesServerSocket = io(sourcesServerURL);
            Logger.info("Zone - Connection to Sources Server done.");
            sourcesServerSocket.emit("newZone", {"id" : this.getId()});
            Logger.info("Zone - Zone declaration done.");
            return sourcesServerSocket;
        } catch(e) {
            Logger.error("Zone - Connection to Sources Server failed !");
            Logger.debug(e.message);
            return null;
        }
    }
}