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
        this._listenForNewInfos();
        this._connectToSourcesServer();
    }

    /**
     * Init listening for new Infos.
     *
     * @method _listenForNewInfos
     * @private
     */
    private _listenForNewInfos() {
        Logger.debug("Listening for new Infos on : zones/" + this._zone.getId() + "/calls/" + this.getId());
        this._sourcesSocket.on("zones/" + this._zone.getId() + "/calls/" + this.getId(), function(infoDescription) {
            Logger.debug("Receive new Infos !");
            Logger.debug(infoDescription);
        });
    }

    /**
     * Perform call connection to Sources Server.
     *
     * @method _connectToSourcesServer
     * @private
     */
    private _connectToSourcesServer() {
        Logger.debug("Connect to Sources Server");
        this._sourcesSocket.emit("zones/" + this._zone.getId() + "/newCall", {"id" : this._id});
        Logger.debug("Connection to Sources Server : Done !");
    }

    /**
     * Returns Call's Id.
     *
     * @method getId
     * @return {number} The call's Id.
     */
    getId() : number {
        return this._id;
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
     * Set Call's Renderer.
     *
     * @method setRenderer
     * @param {Renderer<any>} renderer - The renderer to set to Call
     */
    setRenderer(renderer : Renderer<any>) {
        this._renderer = renderer;
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
     * Set Call's ReceivePolicy.
     *
     * @method setReceivePolicy
     * @param {ReceivePolicy} receivePolicy - The receivePolicy to set to Call
     */
    setReceivePolicy(receivePolicy : ReceivePolicy) {
        this._receivePolicy = receivePolicy;
    }

    /**
     * Returns Call's Render Policy.
     *
     * @method getRenderPolicy
     */
    getRenderPolicy() : RenderPolicy<any> {
        return this._renderPolicy;
    }

    /**
     * Set Call's RenderPolicy.
     *
     * @method setRenderPolicy
     * @param {RenderPolicy<any>} renderPolicy - The renderPolicy to set to Call
     */
    setRenderPolicy(renderPolicy : RenderPolicy<any>) {
        this._renderPolicy = renderPolicy;
    }
}