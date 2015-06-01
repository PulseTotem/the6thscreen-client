/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/timeline/CallItf.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/systemTrigger/SystemTrigger.ts" />
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
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The Call's id.
	 */
	constructor(id: number) {
		this._id = id;
		this._callType = null;
		this._eventOwner = null;
		this._systemTrigger = null;
		this._listInfos = new Array<Info>();
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
		this._listInfos = this._callType.getPolicy().filterInfo(this._listInfos);
		return this._listInfos;
	}

	/**
	 * Start Call activity.
	 *
	 * @method start
	 */
	start() {
		this._connectToSourcesServer();
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
//        Logger.debug("Call '" + this.getId() + "' - 1.2 : Sources Server Listening");
		var self = this;

		this._sourcesServerSocket.on("sourceConnectionDescription", function(response) {
			Utils.manageServerResponse(response, function(sourceConnectionDescription) {
				self._sourceConnectionDescription = sourceConnectionDescription;

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
		this._sourcesServerSocket.emit("callId", {"id" : this.getId()});
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
//        Logger.debug("Call '" + this.getId() + "' - 2.2 : Source listening.");
		var self = this;

		this._sourceSocket.on("pingAnswer", function(response) {
			Utils.manageServerResponse(response, function(pingAnswer) {
				if(! pingAnswer.sendingInfos) {
					Logger.debug("pingAnswer false so do nothing...");
					//self._callDeclarationToSource();
				} else {
					self._callDeclarationToSource();
				}
			}, function(error) {
				Logger.error(error);
			});

		});

		this._sourceSocket.on("newInfo", function(infoDescription) {
			self._onNewInfo(infoDescription);
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
		this._sourceSocket.emit("ping", {"callHash" : this._callHash});
	}

	/**
	 * Step 2.4 : Perform call declaration to Source.
	 *
	 * @method _callDeclarationToSource
	 * @private
	 */
	private _callDeclarationToSource() {
//        Logger.debug("Call '" + this.getId() + "' - 2.4 : Source Call declaration.");
		this._sourceSocket.emit("newCall", {"callHash" : this._callHash});
	}

	/**
	 * Step 3 : Manage new info reception.
	 *
	 * @method _onNewInfo
	 * @param {JSON Object} infoDescription - The new Info Description.
	 * @private
	 */
	private _onNewInfo(infoDescription : any) {
//        Logger.debug("Call '" + this.getId() + "' - 3 : Manage new info reception.");
		var newInfos = this._callType.getRenderer().transformInfo(infoDescription);

		this._systemTrigger.trigger(newInfos, this._eventOwner);

		this._listInfos = this._listInfos.concat(newInfos);
	}
}