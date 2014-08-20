/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../policy/ReceivePolicy.ts" />
/// <reference path="../policy/RenderPolicy.ts" />
/// <reference path="../renderer/Renderer.ts" />
/// <reference path="../info/Info.ts" />

class Call {

    /**
     * Call's id.
     *
     * @property _id
     * @type string
     */
    private _id : string;

    /**
     * Call's hash.
     *
     * @property _hash
     * @type string
     */
    private _hash : string;

    /**
     * Zone's name.
     *
     * @property _zoneName
     * @type string
     */
    private _zoneName : string;

    /**
     * Sources Server's socket.
     *
     * @property _sourcesSocket
     * @type any
     */
    private _sourcesSocket : any;

    /**
     * Call's receive policy.
     *
     * @property _receivePolicy
     * @type ReceivePolicy
     */
    private _receivePolicy : ReceivePolicy;

    /**
     * Call's type renderer.
     *
     * @property _renderer
     * @type Renderer<any>
     */
    private _renderer : Renderer<any>;

    /**
     * Call's render policy.
     *
     * @property _renderPolicy
     * @type RenderPolicy<any>
     */
    private _renderPolicy : RenderPolicy<any>;

    /**
     * Call's infos list.
     *
     * @property _listInfos
     * @type Array<Info>
     */
    private _listInfos : Array<Info>;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} id - The Call's id.
     * @param {string} hash - The Call's hash.
     * @param {string} zoneName - The Zone's name attached to Call.
     * @param {any} socket - The SOurces Server's socket.
     */
    constructor(id : string, hash : string, zoneName : string, socket : any) {
        this._id = id;
        this._hash = hash;
        this._zoneName = zoneName;
        this._sourcesSocket = socket;
        this._connectToSourcesServer();
    }

    /**
     * Perform call connection to Sources Server. Init listening for new Infos.
     *
     * @method _connectToSourcesServer
     * @private
     */
    private _connectToSourcesServer() {
        this._sourcesSocket.emit("zones/" + this._zoneName + "/newCall", {"id" : this._id, "source" : "Twitter", "hash" : this._hash});

        //TODO : Source is in Hash or not ?
        //TODO Listening for new Infos.
    }

    /**
     * Returns Call's Info List.
     *
     * @method getListInfos
     */
    getListInfos() : Array<Info> {
        return this._listInfos;
    }

    /**
     * Returns Call's Renderer.
     *
     * @method getRenderer
     */
    getRenderer() : Renderer<any> {
        return this._renderer;
    }

    /**
     * Returns Call's Render Policy.
     *
     * @method getRenderPolicy
     */
    getRenderPolicy() : RenderPolicy<any> {
        return this._renderPolicy;
    }
}