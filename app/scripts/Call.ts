/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core-client/scripts/policy/ReceivePolicy.ts" />
/// <reference path="../../t6s-core/core-client/scripts/policy/RenderPolicy.ts" />
/// <reference path="../../t6s-core/core-client/scripts/renderer/Renderer.ts" />
/// <reference path="../../t6s-core/core-client/t6s-core/core/scripts/infotype/Info.ts" />

/// <reference path="./Zone.ts" />

declare var io: any; // Use of Socket.IO lib

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
     * @property _sourcesServerSocket
     * @type any
     */
    private _sourcesServerSocket : any;

    /**
     * Source's socket.
     *
     * @property _sourceSocket
     * @type any
     */
    private _sourceSocket : any;

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
        this._sourcesServerSocket = zone.getSourcesServerSocket();
        this._manageSourcesServerConnection();
    }

    /**
     * Manage connection to Sources Server.
     *
     * @method _manageSourcesServerConnection
     * @private
     */
    private _manageSourcesServerConnection() {
        Logger.debug("Manage Sources Server Connection");
        this._listenSourcesServer();
        this._connectToSourcesServer();
    }

    /**
     * Init listening Sources Server.
     *
     * @method _listenSourcesServer
     * @private
     */
    private _listenSourcesServer() {
        var self = this;

        this._sourcesServerSocket.on("zones/" + this._zone.getId() + "/calls/" + this.getId() + "/hash", function(sourceConnectionDescription) {
            Logger.info("Receive Hash !");
            Logger.debug(sourceConnectionDescription);
            self._manageSourceConnection(sourceConnectionDescription);
        });
    }

    /**
     * Perform call connection to Sources Server.
     *
     * @method _connectToSourcesServer
     * @private
     */
    private _connectToSourcesServer() {
        Logger.info("Connect to Sources Server");
        this._sourcesServerSocket.emit("zones/" + this._zone.getId() + "/newCall", {"id" : this._id});
    }

    /**
     * Manage connection to Source.
     *
     * @method _manageSourceConnection
     * @param {any} sourceConnectionDescription - Source's connection description
     * @private
     */
    private _manageSourceConnection(sourceConnectionDescription : any) {
        Logger.debug("Manage Source Connection");
        this._connectToSource(sourceConnectionDescription);
    }

    /**
     * Init listening for new Infos.
     *
     * @method _listenForNewInfos
     * @private
     */
    private _listenForNewInfos() {
        var self = this;

        Logger.debug("Listening for new Infos on : zones/" + this._zone.getId() + "/calls/" + this.getId() + "/newInfo");
        this._sourceSocket.on("zones/" + this._zone.getId() + "/calls/" + this.getId() + "/newInfo", function(infoDescription) {
            Logger.debug("Receive new Infos !");
            Logger.debug(infoDescription);
            //TODO : Retrieve TypeInfo and use it here to transform infoDescription JSON to an InfoType object !!!!! Or not....
            self._listInfos.push(infoDescription);
            //self.getReceivePolicy().process(self._listInfos);
        });

        //_sourceSocket
    }

    /**
     * Perform call connection to Source.
     *
     * @method _connectToSource
     * @param {any} sourceConnectionDescription - Source's connection description.
     * @private
     */
    private _connectToSource(sourceConnectionDescription : any) {
        var self = this;

        this._sourceSocket = io(sourceConnectionDescription.url);
        this._sourceSocket.on("connect", function() {
            Logger.info("Connected to Source.");
            self._listenForNewInfos();
            self._sourceSocket.emit("newClient", {"zoneId" : self._zone.getId(), "callId" : self.getId(), "callHash" : sourceConnectionDescription.hash});
        });

        this._sourceSocket.on("error", function(errorData) {
            Logger.error("An error occurred during connection to Source.");
        });

        this._sourceSocket.on("disconnect", function() {
            Logger.info("Disconnected to Source.");
        });

        this._sourceSocket.on("reconnect", function(attemptNumber) {
            Logger.info("Connected to Source after " + attemptNumber + " attempts.");
        });

        this._sourceSocket.on("reconnect_attempt", function() {
            //TODO?
        });

        this._sourceSocket.on("reconnecting", function(attemptNumber) {
            Logger.info("Trying to connect to Source - Attempt number " + attemptNumber + ".");
        });

        this._sourceSocket.on("reconnect_error", function(errorData) {
            Logger.error("An error occurred during reconnection to Source.");
        });

        this._sourceSocket.on("reconnect_failed", function() {
            Logger.error("Failed to connect to Source. No new attempt will be done.");
        });
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