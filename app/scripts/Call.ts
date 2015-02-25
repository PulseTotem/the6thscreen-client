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
     * The 6th Screen Sources Server's URL.
     *
     * @property _sourcesServerURL
     * @type string
     */
    private _sourcesServerURL : string = "http://localhost:5000/calls";

    /**
     * The 6th Screen Sources Server's socket.
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
     * Call's hash.
     *
     * @property _callHash
     * @type string
     */
    private _callHash : string;


    ///////////// Variables to manage process connection with Sources Server and Source ///////////

    /**
     * Source connection description for Call.
     *
     * @property _sourceConnectionDescription
     * @type any
     */
    private _sourceConnectionDescription : any;

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
        this._listInfos = new Array<Info>();

        this._sourceConnectionDescription = null;
        this._callHash = "";
    }

    /**
     * Step 0 : Activate connections to SourceServer and Source
     *
     * @method activate
     */
    activate() {
        this._connectToSourcesServer();
    }

    /**
     * Step 1.1 : Connect to The6thScreen Sources' Server.
     *
     * @method _connectToSourcesServer
     * @private
     */
    private _connectToSourcesServer() {
//        Logger.debug("Call - 1.1 : Sources Server Connection");
        var self = this;

        this._sourcesServerSocket = io(this._sourcesServerURL,
            {"reconnection" : true, 'reconnectionAttempts' : 10, "reconnectionDelay" : 1000, "reconnectionDelayMax" : 5000, "timeout" : 5000, "autoConnect" : true, "multiplex": false});

        this._listenSourcesServer();

        this._sourcesServerSocket.on("connect", function() {
//            Logger.info("Call#" + self.getId() + "::_connectToSourcesServer : Connected to Sources Server.");
            self._manageSourcesServerConnection();
        });

        this._sourcesServerSocket.on("error", function(errorData) {
            Logger.error("Call#" + self.getId() + "::_connectToSourcesServer : An error occurred during connection to Sources Server.");
            Logger.debug(errorData);
        });

        this._sourcesServerSocket.on("disconnect", function() {
            Logger.info("Call#" + self.getId() + "::_connectToSourcesServer : Disconnected from Sources Server.");
        });

        this._sourcesServerSocket.on("reconnect", function(attemptNumber) {
            Logger.info("Call#" + self.getId() + "::_connectToSourcesServer : Connected to Sources Server after " + attemptNumber + " attempts.");
        });

        this._sourcesServerSocket.on("reconnect_attempt", function() {
            Logger.info("Call#" + self.getId() + "::_connectToSourcesServer : Trying to reconnect to Sources Server.");
        });

        this._sourcesServerSocket.on("reconnecting", function(attemptNumber) {
            Logger.info("Call#" + self.getId() + "::_connectToSourcesServer : Trying to connect to Sources Server - Attempt number " + attemptNumber + ".");
        });

        this._sourcesServerSocket.on("reconnect_error", function(errorData) {
            Logger.error("Call#" + self.getId() + "::_connectToSourcesServer : An error occurred during reconnection to Sources Server.");
            Logger.debug(errorData);
        });

        this._sourcesServerSocket.on("reconnect_failed", function() {
            Logger.error("Call#" + self.getId() + "::_connectToSourcesServer : Failed to connect to Sources Server. No new attempt will be done.");
        });
    }

    /**
     * Step 1.2 : Init listening Sources Server.
     *
     * @method _listenSourcesServer
     * @private
     */
    private _listenSourcesServer() {
//        Logger.debug("Call - 1.2 : Sources Server Listening");
        var self = this;

        this._sourcesServerSocket.on("sourceConnectionDescription", function(sourceConnectionDescription) {
            self._sourceConnectionDescription = sourceConnectionDescription;

            self._connectToSource();
        });
    }

    /**
     * Manage connection to Sources Server.
     *
     * @method _manageSourcesServerConnection
     * @private
     */
    private _manageSourcesServerConnection() {
        var self = this;

        if(this._sourceConnectionDescription == null) {
            this._callDeclaration();
        }
    }

    /**
     * Step 1.3 : Perform call declaration to Sources Server.
     *
     * @method _callDeclaration
     * @private
     */
    private _callDeclaration() {
//        Logger.debug("Call - 1.3 : Sources server Call declaration");
        this._sourcesServerSocket.emit("callId", {"id" : this.getId()});
    }

    /**
     * Connection to Source.
     *
     * @method _connectToSource
     * @private
     */
    private _connectToSource() {
//        Logger.debug("Call - 2.1 : Manage connection to Source");
//        Logger.debug("Call - 2.1 : SourceConnectionDescription URL => " + this._sourceConnectionDescription.url + " HASH => " + this._sourceConnectionDescription.hash);
        this._callHash = this._sourceConnectionDescription.hash;

        var self = this;

        this._sourceSocket = io(this._sourceConnectionDescription.url,
            {"reconnection" : true, 'reconnectionAttempts' : 10, "reconnectionDelay" : 1000, "reconnectionDelayMax" : 5000, "timeout" : 5000, "autoConnect" : true, "multiplex": false});

        this._listenForSource();

        this._sourceSocket.on("connect", function() {
//            Logger.info("Call#" + self.getId() + "::_connectToSource : Connected to Source.");
            self._manageSourceConnection();
        });

        this._sourceSocket.on("error", function(errorData) {
            Logger.error("Call#" + self.getId() + "::_connectToSource : An error occurred during connection to Source.");
            Logger.debug(errorData);
        });

        this._sourceSocket.on("disconnect", function() {
            Logger.info("Call#" + self.getId() + "::_connectToSource : Disconnected to Source.");
        });

        this._sourceSocket.on("reconnect", function(attemptNumber) {
            Logger.info("Call#" + self.getId() + "::_connectToSource : Connected to Source after " + attemptNumber + " attempts.");
        });

        this._sourceSocket.on("reconnect_attempt", function() {
            Logger.info("Call#" + self.getId() + "::_connectToSource : Trying to reconnect to Source.");
        });

        this._sourceSocket.on("reconnecting", function(attemptNumber) {
            Logger.info("Call#" + self.getId() + "::_connectToSource : Trying to connect to Source - Attempt number " + attemptNumber + ".");
        });

        this._sourceSocket.on("reconnect_error", function(errorData) {
            Logger.error("Call#" + self.getId() + "::_connectToSource : An error occurred during reconnection to Source.");
            Logger.debug(errorData);
        });

        this._sourceSocket.on("reconnect_failed", function() {
            Logger.error("Call#" + self.getId() + "::_connectToSource : Failed to connect to Source. No new attempt will be done.");
        });
    }

    /**
     * Step 2.2 : Init listening for Source.
     *
     * @method _listenForSource
     * @private
     */
    private _listenForSource() {
//        Logger.debug("Call - 2.2 : Source listening.");
        var self = this;

        this._sourceSocket.on("pingAnswer", function(pingAnswer) {
            if(! pingAnswer.sendingInfos) {
                Logger.debug("pingAnswer false so do nothing...");
                //self._callDeclarationToSource();
            } else {
                self._callDeclarationToSource();
            }
        });

        this._sourceSocket.on("newInfo", function(infoDescription) {
            self._listInfos.push(infoDescription);
            self._zone.refreshBehaviour();
        });
    }

    /**
     * Step 2.3 : Manage connection to Source.
     *
     * @method _manageSourceConnection
     * @private
     */
    private _manageSourceConnection() {
//        Logger.debug("Call - 2.3 : Manage Source Connection.");
        this._sourceSocket.emit("ping", {"callHash" : this._callHash});
    }

    /**
     * Step 2.4 : Perform call declaration to Source.
     *
     * @method _callDeclarationToSource
     * @private
     */
    private _callDeclarationToSource() {
//        Logger.debug("Call - 2.4 : Source Call declaration.");
        this._sourceSocket.emit("newCall", {"callHash" : this._callHash});
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