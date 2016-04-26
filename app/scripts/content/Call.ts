/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/core/MessageBus.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/timeline/CallItf.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/systemTrigger/SystemTrigger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/staticSource/StaticSource.ts" />
/// <reference path="../structure/CallType.ts" />
/// <reference path="../core/Constants.ts" />
/// <reference path="./RelativeEvent.ts" />

/**
 * Represents a Call of The6thScreen Client.
 *
 * @class Call
 * @implements CallItf
 */
class Call implements CallItf {

	/**
	 * Call's id.
	 *
	 * @property _id
	 * @type number
	 */
	private _id : number;

	/**
	 * Call's channel.
	 *
	 * @property _channel
	 * @type string
	 */
	private _channel : string;

	/**
	 * CallType attached to Call.
	 *
	 * @property _callType
	 * @type CallType
	 */
	private _callType : CallType;

	/**
	 * Call's owner (RelativeEvent).
	 *
	 * @property _eventOwner
	 * @type RelativeEvent
	 */
	private _eventOwner : RelativeEvent;

	/**
	 * SystemTrigger attached to Call.
	 *
	 * @property _systemTrigger
	 * @type SystemTrigger
	 */
	private _systemTrigger : SystemTrigger;

	/**
	 * RendererTheme attached to Call.
	 *
	 * @property _rendererTheme
	 * @type RendererTheme
	 */
	private _rendererTheme : string;

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

	/**
	 * Source connection description for Call.
	 *
	 * @property _sourceConnectionDescription
	 * @type any
	 */
	private _sourceConnectionDescription : any;

	/**
	 * Call's 'connectedToSource' status.
	 *
	 * @property _connectedToSource
	 * @type boolean
	 */
	private _connectedToSource : boolean;

	/**
	 * StaticSource instance if this call refers to a static source
	 *
	 * @property _staticSource
	 * @type StaticSource
	 */
	private _staticSource : StaticSource<any>;

	/**
	 * Id of the SDI
	 *
	 * @property _sdiId
	 * @type number
	 */
	private _sdiId : number;

	/**
	 * Id of the profil
	 *
	 * @property _profilId
	 * @type number
	 */
	private _profilId : number;

	/**
	 * Hash of the profil
	 *
	 * @property
	 * @type string
	 */
	private _hashProfil : string;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The Call's id.
	 */
	constructor(id: number) {
		var self = this;

		this._id = id;
		this._channel = "Call." + id;
		this._callType = null;
		this._eventOwner = null;
		this._systemTrigger = null;
		this._listInfos = new Array<Info>();

		this._connectedToSource = false;
		this._staticSource = null;

		this._sdiId = null;
		this._profilId = null;
		this._hashProfil = null;

		MessageBus.subscribe(this._channel, function(msg, callData) {
			self._sourceSocket.emit(callData.action, callData.data);
		});
	}

	/**
	 * Returns Call's Id.
	 *
	 * @method getId
	 * @return {number} The Call's Id.
	 */
	getId() : number {
		return this._id;
	}

	/**
	 * Set the Call's rendererTheme.
	 *
	 * @method setRendererTheme
	 * @param {string} rendererTheme - The RendererTheme to set.
	 */
	setRendererTheme(rendererTheme : string) {
		this._rendererTheme = rendererTheme;
	}

	/**
	 * Get the Call's rendererTheme.
	 *
	 * @method getRendererTheme
	 * @return {string} rendererTheme - The CallType's RendererTheme.
	 */
	getRendererTheme() : string {
		return this._rendererTheme;
	}

	/**
	 * Set the Call's callType.
	 *
	 * @method setCallType
	 * @param {CallType} callType - The CallType to set.
	 */
	setCallType(callType : CallType) {
		this._callType = callType;
	}

	/**
	 * Set the Call's owner.
	 *
	 * @method setEventOwner
	 * @param {RelativeEvent} relativeEvent - The RelativeEvent to set as call's owner.
	 */
	setEventOwner(relativeEvent : RelativeEvent) {
		this._eventOwner = relativeEvent;
	}

	/**
	 * Set the Call's systemTrigger.
	 *
	 * @method setSystemTrigger
	 * @param {SystemTrigger} systemTrigger - The SystemTrigger to set.
	 */
	setSystemTrigger(systemTrigger : SystemTrigger) {
		this._systemTrigger = systemTrigger;
	}

	/**
	 * Set the Call's staticSource
	 *
	 * @method setStaticSource
	 * @param staticSource
	 */
	setStaticSource(staticSource : StaticSource<any>) {
		this._staticSource = staticSource;
	}

	/**
	 * Get the Call's staticSource
	 *
	 * @method getStaticSource
	 * @returns {StaticSource}
	 */
	getStaticSource() : StaticSource<any> {
		return this._staticSource;
	}

	/**
	 * Set the Call's SDIId
	 *
	 * @method setSDIId
	 * @param sdiId
     */
	setSDIId(sdiId : number) {
		this._sdiId = sdiId;
	}

	/**
	 * Get the Call's SDIId
	 *
	 * @method getSDIId
	 * @returns {number}
     */
	getSDIId() : number {
		return this._sdiId;
	}

	/**
	 * Set the Call's ProfilId
	 *
	 * @method setProfilid
	 * @param profilId
     */
	setProfilId(profilId : number) {
		this._profilId = profilId;
	}

	/**
	 * Get the Call's ProfilId
	 *
	 * @method getProfilId
	 * @returns {number}
     */
	getProfilId() : number {
		return this._profilId;
	}

	/**
	 * Set the Call's Hahsprofil
	 *
	 * @method setHashProfil
	 * @param hashProfil
     */
	setHashProfil(hashProfil : string) {
		this._hashProfil = hashProfil;
	}

	/**
	 * Get the Call's hashProfil
	 *
	 * @method getHashProfil
	 * @returns {string}
     */
	getHashProfil() : string {
		return this._hashProfil;
	}

	/**
	 * Get the Call's callType.
	 *
	 * @method getCallType
	 * @return {CallType} callType - The Call's CallType.
	 */
	getCallType() : CallType {
		return this._callType;
	}

	/**
	 * Returns Call's Info List.
	 *
	 * @method getListInfos
	 */
	getListInfos() : Array<Info> {
		this._listInfos = this._callType.getPolicy().filterOnGet(this._listInfos);
		return this._listInfos;
	}

	/**
	 * Start Call activity.
	 *
	 * @method start
	 */
	start() {
		if (this._staticSource == null) {
			this._connectToSourcesServer();
		} else {
			this._staticSource.setCall(this);
			this._staticSource.start();
		}
	}

	/**
	 * Step 1.1 : Connect to The6thScreen Sources' Server.
	 *
	 * @method _connectToSourcesServer
	 * @private
	 */
	private _connectToSourcesServer() {
//        Logger.debug("Call '" + this.getId() + "' - 1.1 : Sources Server Connection");
		var self = this;

		this._sourcesServerSocket = io(Constants.SOURCES_SERVER_URL,
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
			self._manageSourcesServerConnection();
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
			Logger.error("Call#" + self.getId() + "::_connectToSourcesServer : Failed to connect to Sources Server. New attempt will be done in 5 seconds. Administrators received an Alert !");
			//TODO: Send an email and Notification to Admins !

			setTimeout(function() {
				self._sourcesServerSocket = null;
				self._connectToSourcesServer();
			}, 5000);
		});
	}

	/**
	 * Disconnection from SourcesServer.
	 *
	 * @method _disconnectFromSourcesServer
	 * @private
	 */
	private _disconnectFromSourcesServer() {
		if(typeof(this._sourcesServerSocket) != "undefined" && this._sourcesServerSocket != null) {
			//Disconnection from SourcesServer
			this._sourcesServerSocket.disconnect();
			this._sourcesServerSocket = null;
		} // else // Nothing to do...
	}

	/**
	 * Step 1.2 : Init listening Sources Server.
	 *
	 * @method _listenSourcesServer
	 * @private
	 */
	private _listenSourcesServer() {
//        Logger.debug("Call '" + this.getId() + "' - 1.2 : Sources Server Listening");
		var self = this;

		this._sourcesServerSocket.on("sourceConnectionDescription", function(response) {
			Utils.manageServerResponse(response, function(sourceConnectionDescription) {
				self._sourceConnectionDescription = sourceConnectionDescription;

				self._disconnectFromSourcesServer();

				self._connectToSource();
			}, function(error) {
				Logger.error(error);
			});

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
//        Logger.debug("Call '" + this.getId() + "' - 1.3 : Sources server Call declaration");

		var info = {
			"id": this.getId(),
			"sdiId": this.getSDIId(),
			"profilId": this.getProfilId(),
			"hash": this.getHashProfil()
		};

		this._sourcesServerSocket.emit("callId", info);
	}

	/**
	 * Connection to Source.
	 *
	 * @method _connectToSource
	 * @private
	 */
	private _connectToSource() {
//        Logger.debug("Call '" + this.getId() + "' - 2.1 : Manage connection to Source");
//        Logger.debug("Call '" + this.getId() + "' - 2.1 : SourceConnectionDescription URL => " + this._sourceConnectionDescription.url + " HASH => " + this._sourceConnectionDescription.hash);
		this._callHash = this._sourceConnectionDescription.hash;

		var self = this;

		this._sourceSocket = io(this._sourceConnectionDescription.url,
			{"reconnection" : true, 'reconnectionAttempts' : 10, "reconnectionDelay" : 1000, "reconnectionDelayMax" : 5000, "timeout" : 5000, "autoConnect" : true, "multiplex": false});

		this._listenForSource();

		this._sourceSocket.on("connect", function() {
//            Logger.info("Call#" + self.getId() + "::_connectToSource : Connected to Source. Socket.id : " + self._sourceSocket.id);
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
			self._disconnectFromSource();
			self._connectToSource();
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
			Logger.error("Call#" + self.getId() + "::_connectToSource : Failed to connect to Source. New attempt will be done in 5 seconds. Administrators received an Alert !");
			//TODO: Send an email and Notification to Admins !

			setTimeout(function() {
				self._sourceSocket = null;
				self._connectToSource();
			}, 5000);
		});
	}

	/**
	 * Disconnection from Source.
	 *
	 * @method _disconnectFromSource
	 * @private
	 */
	private _disconnectFromSource() {
		if(typeof(this._sourceSocket) != "undefined" && this._sourceSocket != null) {
			//Disconnection from SourcesServer
			this._sourceSocket.disconnect();
			this._sourceSocket = null;
			this._connectedToSource = false;
		} // else // Nothing to do...
	}

	/**
	 * Step 2.2 : Init listening for Source.
	 *
	 * @method _listenForSource
	 * @private
	 */
	private _listenForSource() {
//        Logger.debug("Call '" + this.getId() + "' - 2.2 : Source listening.");
		var self = this;

		this._sourceSocket.on("CallOK", function(response) {
			Utils.manageServerResponse(response, function(hashDescription) {
				self._connectedToSource = true;
			}, function(hashDescription) {
				self._disconnectFromSource();
				self._disconnectFromSourcesServer();
				self._sourceConnectionDescription = null;
				self._callHash = "";
				self._connectedToSource = false;
				self._connectToSourcesServer();
			});
		});

		this._sourceSocket.on("newInfo", function(infoDescription) {
			self.onNewInfo(infoDescription);
		});
	}

	/**
	 * Step 2.3 : Manage connection to Source.
	 *
	 * @method _manageSourceConnection
	 * @private
	 */
	private _manageSourceConnection() {
//        Logger.debug("Call '" + this.getId() + "' - 2.3 : Manage Source Connection.");

		if(! this._connectedToSource) {
	//        Logger.debug("Call '" + this.getId() + "' - Source Call declaration.");
			this._sourceSocket.emit("newCall", {"callHash": this._callHash});
		}
	}

	/**
	 * Step 3 : Manage new info reception.
	 *
	 * @method onNewInfo
	 * @param {JSON Object} infoDescription - The new Info Description.
	 */
	public onNewInfo(infoDescription : any) {
//        Logger.debug("Call '" + this.getId() + "' - 3 : Manage new info reception.");
		var self = this;
		var newInfos = this._callType.getRenderer().transformInfo(infoDescription);

		newInfos.forEach(function(info : Info) {
			info.setCallChannel(self._channel);
		});

		this._systemTrigger.trigger(newInfos, this._eventOwner);

		this._listInfos = this._callType.getPolicy().filterOnNew(this._listInfos, newInfos);
	}
}