/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core-client/scripts/policy/ReceivePolicy.ts" />
/// <reference path="../../t6s-core/core-client/scripts/policy/RenderPolicy.ts" />
/// <reference path="../../t6s-core/core-client/scripts/renderer/Renderer.ts" />
/// <reference path="../../t6s-core/core-client/t6s-core/core/scripts/infotype/Info.ts" />

/// <reference path="./Zone.ts" />

class Call {

    /**
     * Call's id.
     *
     * @property _id
     * @type number
     */
    private _id : number;

    /**
     * Call's Zone.
     *
     * @property _zone
     * @type Zone
     */
    private _zone : Zone;

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
     * @param {number} id - The Call's id.
     * @param {Zone} zone - The Zone's attached to Call.
     */
    constructor(id : number, zone : Zone) {
        this._id = id;
        this._zone = zone;
        this._sourcesSocket = zone.getSourcesServerSocket();
        this._connectToSourcesServer();
    }

    /**
     * Perform call connection to Sources Server. Init listening for new Infos.
     *
     * @method _connectToSourcesServer
     * @private
     */
    private _connectToSourcesServer() {
        Logger.debug("Connect to Sources Server");
        this._sourcesSocket.emit("zones/" + this._zone.getId() + "/newCall", {"id" : this._id});
        Logger.debug("Connection to Sources Server : Done !");

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
     * Returns Call's Receive Policy.
     *
     * @method getReceivePolicy
     */
    getReceivePolicy() : ReceivePolicy {
        return this._receivePolicy;
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