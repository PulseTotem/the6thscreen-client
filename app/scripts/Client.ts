/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../t6s-core/core-client/scripts/core/Utils.ts" />

/// <reference path="./core/Constants.ts" />

/// <reference path="./structure/Zone.ts" />
/// <reference path="./structure/CallType.ts" />

declare var io: any; // Use of Socket.IO lib
declare var $: any; // Use of JQuery

class Client {

    /**
     * The 6th Screen Backend's socket.
     *
     * @property _backendSocket
     * @type any
     */
    private _backendSocket : any;

	/**
	 * The Client's Zones.
	 *
	 * @property _zones
	 * @type Array<Zone>
	 */
	private _zones : Array<Zone>;

	/**
	 * The Client's CallTypes.
	 *
	 * @property _callTypes
	 * @type Array<CallType>
	 */
	private _callTypes : Array<CallType>;

	/**
	 * Client Structure is ready.
	 *
	 * @property _structureReady
	 * @type boolean
	 */
	private _structureReady : boolean;

    ///////////// Variables to manage process connection with Backend ///////////

    /**
     * SDI Description.
     *
     * @property _sdiDescription
     * @type JSON Object
     */
    private _sdiDescription : any;

    /**
     * Profil Description.
     *
     * @property _profilDescription
     * @type JSON Object
     */
    private _profilDescription : any;

    /**
     * Constructor.
     *
     * @constructor
     */
    constructor() {
        this._sdiDescription = null;
        this._profilDescription = null;
		this._zones = new Array<Zone>();
		this._callTypes = new Array<CallType>();
		this._structureReady = false;
    }

    /**
     * To run the client.
     *
     * @method run
     */
    run() {
        var self = this;

        Logger.info("____________________________________________________________________________________________________");
        Logger.info("                                  The 6th Screen Client !                                           ");
        Logger.info("                                    Welcome and enjoy !                                             ");
        Logger.info("____________________________________________________________________________________________________");

        this._backendSocket = io(Constants.BACKEND_URL,
            {"reconnection" : true, 'reconnectionAttempts' : 10, "reconnectionDelay" : 1000, "reconnectionDelayMax" : 5000, "timeout" : 5000, "autoConnect" : true, "multiplex": false});

        this.listen();

        this._backendSocket.on("connect", function() {
            self.manageBackendConnection();
        });

        this._backendSocket.on("error", function(errorData) {
            Logger.error("An error occurred during connection to Backend.");
        });

        this._backendSocket.on("disconnect", function() {
            Logger.info("Disconnected to Backend.");
        });

        this._backendSocket.on("reconnect", function(attemptNumber) {
            Logger.info("Connected to Backend after " + attemptNumber + " attempts.");
        });

        this._backendSocket.on("reconnect_attempt", function() {
            Logger.info("Trying to reconnect to Backend.");
        });

        this._backendSocket.on("reconnecting", function(attemptNumber) {
            Logger.info("Trying to connect to Backend - Attempt number " + attemptNumber + ".");
        });

        this._backendSocket.on("reconnect_error", function(errorData) {
            Logger.error("An error occurred during reconnection to Backend.");
        });

        this._backendSocket.on("reconnect_failed", function() {
            Logger.error("Failed to connect to Backend. No new attempt will be done.");
        });



        /**
         * TODO : Put it in a zone with special behaviour.
         *
         * Hack to update time in screen.
         *
         */
        var updateTime = function() {
            var currentDate : any = new Date();
            $("#date_time").html(currentDate.toString("HH") + "h" + currentDate.toString("mm"));
        };
        updateTime();
        setInterval(updateTime, 1000*10);
    }

    /**
     * Step 0.1 : Listen for Backend answers.
     *
     * @method listen
     */
    listen() {
//        Logger.debug("0.1 - listen");
        var self = this;

		this._backendSocket.on("SDIDescription", function(response) {
			Utils.manageServerResponse(response, function(sdiDescription) {
				if(self._sdiDescription == null) {
					self._sdiDescription = sdiDescription;
					self.buildClientStructure();
				}
			}, function(error) {
				Logger.error(error);
			});
		});

        this._backendSocket.on("ProfilDescription", function(response) {
            Utils.manageServerResponse(response, function(profilDescription) {
                if(self._profilDescription == null) {
					self._profilDescription = profilDescription;
					self.buildClientContent();
				}
            }, function(error) {
                Logger.error(error);
            });
        });
    }

    /**
     * Manage connection with backend.
     *
     * @method manageBackendConnection
     */
    manageBackendConnection() {
        if(this._sdiDescription == null || this._profilDescription == null) {
            this.init();
        }
    }

    /**
     * Build the client step by step.
     * Step 0.2 : Retrieving SDI and Profil Information.
     *
     * @method init
     */
    init() {
//        Logger.debug("0.2 - init");
        var hash = this.getQueryVariable("hash");

        if(hash != "") {
			this._backendSocket.emit("HashDescription", {"hash" : hash});
        } else {
            Logger.error("The 6th Screen Client's URL is not correct : Missing parameters.");
        }
    }

	/**
	 * Step 1 : Build Client Structure from SDI Description.
	 *
	 */
	buildClientStructure() {
//        Logger.debug("1 - buildClientStructure");
		var self = this;

		if(this._sdiDescription != null) {
			this._sdiDescription.zones.forEach(function(zoneDescription : any) {
				if(self._retrieveZone(zoneDescription.id) == null) {
					var newZone:Zone = new Zone(zoneDescription.id, zoneDescription.name, zoneDescription.description, zoneDescription.width, zoneDescription.height, zoneDescription.positionFromTop, zoneDescription.positionFromLeft);
					newZone.attachToDom("#the6thscreen-client-content");

					if (window[zoneDescription.behaviour["name"]]) {
						var behaviour = new window[zoneDescription.behaviour["name"]]();
						newZone.setBehaviour(behaviour);
					} else {
						Logger.error("Behaviour '" + zoneDescription.behaviour["name"] + "' was not found.");
					}

					self._zones.push(newZone);

					zoneDescription.callTypes.forEach(function (callTypeDescription:any) {
						if(self._retrieveCallType(callTypeDescription.id) == null) {
							var newCallType:CallType = new CallType(callTypeDescription.id, callTypeDescription.name, callTypeDescription.description);

							if (window[callTypeDescription.renderer["name"]]) {
								var renderer = new window[callTypeDescription.renderer["name"]]();
								newCallType.setRenderer(renderer);
							} else {
								Logger.error("Renderer '" + callTypeDescription.renderer["name"] + "' was not found.");
							}

							if (window[callTypeDescription.policy["name"]]) {
								var policy = new window[callTypeDescription.policy["name"]]();
								newCallType.setPolicy(policy);
							} else {
								Logger.error("Policy '" + callTypeDescription.policy["name"] + "' was not found.");
							}

							self._callTypes.push(newCallType);
						}
					});
				}

			});

			this._structureReady = true;
		} else {
			Logger.error("An error occured during Client's structure building.");
		}
	}

	/**
	 * Step 2 : Build Client Content from Profil Description.
	 *
	 */
	buildClientContent() {
//        Logger.debug("2 - buildClientContent");
		var self = this;
		if(this._structureReady) {
			//TODO
		}
	}

/////////////////// HELPER methods ! ///////////////////

	/**
	 * Return a Zone from Zone's Id.
	 *
	 * @method _retrieveZone
	 * @param {number} zoneId - The Zone's Id.
	 * @private
	 */
	private _retrieveZone(zoneId : number) {
		for(var iZone in this._zones) {
			var zone = this._zones[iZone];
			if(zone.getId() == zoneId) {
				return zone;
			}
		}

		return null;
	}

	/**
	 * Return a CallType from CallType's Id.
	 *
	 * @method _retrieveCallType
	 * @param {number} callTypeId - The CallType's Id.
	 * @private
	 */
	private _retrieveCallType(callTypeId : number) {
		for(var iCallType in this._callTypes) {
			var callType = this._callTypes[iCallType];
			if(callType.getId() == callTypeId) {
				return callType;
			}
		}

		return null;
	}

    /**
     * Analyzes search query in location address and
     * returns value for searched variable.
     *
     * @method getQueryVariable
     * @private
     * @param {string} variable - The query variable to retrieve.
     * @returns {string} value of query variable (Empty string if not found).
     */
    private getQueryVariable(variable : string) : string {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1].replace(/%3B/g, ";").replace(/%2F/g, "/");
            }
        }
        return "";
    }

}