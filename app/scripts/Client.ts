/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../t6s-core/core-client/scripts/core/Utils.ts" />

/// <reference path="./core/Constants.ts" />

/// <reference path="./structure/Zone.ts" />
/// <reference path="./structure/CallType.ts" />

/// <reference path="../../t6s-core/core-client/scripts/behaviour/Behaviour.ts" />

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

	/**
	 * The Client's Behaviours.
	 *
	 * @property _behaviours
	 * @type Array<boolean>
	 */
	private _behaviours : Array<boolean>;

	/**
	 * The Client's Renderers.
	 *
	 * @property _renderers
	 * @type Array<boolean>
	 */
	private _renderers : Array<boolean>;

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
		this._behaviours = new Array<boolean>();
		this._renderers = new Array<boolean>();
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

        this.connectToBackend();

        /**
         * TODO : Put it in a zone with special behaviour.
         *
         * Hack to update time in screen.
         *
         * /
        var updateTime = function() {
            var currentDate : any = new Date();
            $("#date_time").html(currentDate.toString("HH") + "h" + currentDate.toString("mm"));
        };
        updateTime();
        setInterval(updateTime, 1000*10);
		 */
    }

	/**
	 * Manage connection to Backend.
	 *
	 * @method connectToBackend
	 */
	connectToBackend() {
		var self = this;

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
			Logger.error("Failed to connect to Backend. New attempt will be done in 5 seconds. Administrators received an Alert !");
			//TODO: Send an email and Notification to Admins !

			setTimeout(function() {
				self._backendSocket = null;
				self.connectToBackend();
			}, 5000);
		});
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

	    this._backendSocket.on('RefreshClient', function(response) {
		    Utils.manageServerResponse(response, function() {
			    location.reload();
		    }, function (error) {
			    Logger.error(error);
		    });
	    });

	    this._backendSocket.on('IdentifyClient', function(response) {
		    Utils.manageServerResponse(response, function(clientID) {
			    self.displayIdentifier(clientID);
		    }, function (error) {
			    Logger.error(error);
		    });
	    });
    }

	displayIdentifier(toDisplay : string) {
		Logger.debug("Get client identity : "+toDisplay);
		var self = this;
		var idZone = $('#identifier');
		idZone.empty();
		idZone.append(toDisplay);
		idZone.css('display','block');

		setTimeout(self.hideIdentifier, 30000);
	}

	hideIdentifier() {
		var idZone = $('#identifier');
		idZone.css('display','none');
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
			//TODO: Manage theme. $('head').append('<link rel="stylesheet/less" type="text/less" href="static/themes/basic.less" />');

			if(self._sdiDescription.theme.backgroundImageURL != "" && self._sdiDescription.theme.backgroundImageURL != null) {
				$('#wrapper_background').css('background-image', 'url(' + self._sdiDescription.theme.backgroundImageURL + ')');
			}

			if(self._sdiDescription.theme.opacity != "" && self._sdiDescription.theme.opacity != null) {
				$('#wrapper_background').css('opacity', self._sdiDescription.theme.opacity);
			}

			if(self._sdiDescription.theme.backgroundColor != "" && self._sdiDescription.theme.backgroundColor != null) {
				$('#wrapper_background').css('background-color', self._sdiDescription.theme.backgroundColor);
			}

			if(self._sdiDescription.theme.font != "" && self._sdiDescription.theme.font != null) {
				$('#wrapper').css('font', self._sdiDescription.theme.font);
			}

			if(self._sdiDescription.theme.color != "" && self._sdiDescription.theme.color != null) {
				$('#wrapper').css('color', self._sdiDescription.theme.color);
			}

			self._sdiDescription.zones.forEach(function(zoneDescription : any) {
				if(self._retrieveZone(zoneDescription.id) == null) {
					var newZone:Zone = new Zone(zoneDescription.id, zoneDescription.name, zoneDescription.description, zoneDescription.width, zoneDescription.height, zoneDescription.positionFromTop, zoneDescription.positionFromLeft);
					newZone.attachToDom("#the6thscreen-client-content");

					var zoneDiv = newZone.getZoneDiv();
					var zoneBackgroundDiv = newZone.getZoneBackgroundDiv();

					if(zoneDescription.theme != null) {
						if (zoneDescription.theme.backgroundImageURL != "" && zoneDescription.theme.backgroundImageURL != null) {
							zoneBackgroundDiv.css('background-image', 'url(' + zoneDescription.theme.backgroundImageURL + ')');
						}

						if(zoneDescription.theme.opacity != "" && zoneDescription.theme.opacity != null) {
							zoneBackgroundDiv.css('opacity', zoneDescription.theme.opacity);
						}

						if(zoneDescription.theme.backgroundColor != "" && zoneDescription.theme.backgroundColor != null) {
							zoneBackgroundDiv.css('background-color', zoneDescription.theme.backgroundColor);
						}

						if (zoneDescription.theme.font != "" && zoneDescription.theme.font != null) {
							zoneDiv.css('font', zoneDescription.theme.font);
						}

						if (zoneDescription.theme.color != "" && zoneDescription.theme.color != null) {
							zoneDiv.css('color', zoneDescription.theme.color);
						}

						if (zoneDescription.theme.border != "" && zoneDescription.theme.border != null) {
							zoneDiv.css('border', zoneDescription.theme.border);
						}
					} else {
						if(self._sdiDescription.theme.themeZone.backgroundImageURL != "" && self._sdiDescription.theme.themeZone.backgroundImageURL != null) {
							zoneBackgroundDiv.css('background-image', 'url(' + self._sdiDescription.theme.themeZone.backgroundImageURL + ')');
						}

						if(self._sdiDescription.theme.themeZone.opacity != "" && self._sdiDescription.theme.themeZone.opacity != null) {
							zoneBackgroundDiv.css('opacity', self._sdiDescription.theme.themeZone.opacity);
						}

						if(self._sdiDescription.theme.themeZone.backgroundColor != "" && self._sdiDescription.theme.themeZone.backgroundColor != null) {
							zoneBackgroundDiv.css('background-color', self._sdiDescription.theme.themeZone.backgroundColor);
						}

						if(self._sdiDescription.theme.themeZone.font != "" && self._sdiDescription.theme.themeZone.font != null) {
							zoneDiv.css('font', self._sdiDescription.theme.themeZone.font);
						}

						if(self._sdiDescription.theme.themeZone.color != "" && self._sdiDescription.theme.themeZone.color != null) {
							zoneDiv.css('color', self._sdiDescription.theme.themeZone.color);
						}

						if(self._sdiDescription.theme.themeZone.border != "" && self._sdiDescription.theme.themeZone.border != null) {
							zoneDiv.css('border', self._sdiDescription.theme.themeZone.border);
						}
					}

					if (window[zoneDescription.behaviour["name"]]) {
						var behaviour = new window[zoneDescription.behaviour["name"]]();
						newZone.setBehaviour(behaviour);

						if(typeof(self._behaviours[zoneDescription.behaviour["name"]]) == "undefined") {
							self._behaviours[zoneDescription.behaviour["name"]] = true;
							//Include by less compilation. $('head').append('<link rel="stylesheet/less" type="text/less" href="static/behaviours/' + zoneDescription.behaviour["name"] + '.less" />');
						}

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

								if(typeof(self._renderers[callTypeDescription.renderer["name"]]) == "undefined") {
									self._renderers[callTypeDescription.renderer["name"]] = true;
									//Include by less compilation. $('head').append('<link rel="stylesheet/less" type="text/less" href="static/renderers/' + callTypeDescription.renderer["name"] + '.less" />');
								}

								if (callTypeDescription.source.isStatic) {
									newCallType.setStaticSourceName(callTypeDescription.source.name);
									newCallType.setStaticRefreshTime(callTypeDescription.source.refreshTime);
								}
							} else {
								Logger.error("Renderer '" + callTypeDescription.renderer["name"] + "' was not found.");
							}

							if(callTypeDescription.policy == null) {
								newCallType.setPolicy(new IdemPolicy());
							} else {
								if (window[callTypeDescription.policy["name"]]) {
									var policy = new window[callTypeDescription.policy["name"]]();
									newCallType.setPolicy(policy);
								} else {
									Logger.error("Policy '" + callTypeDescription.policy["name"] + "' was not found.");
								}
							}

							self._callTypes.push(newCallType);
						}
					});
				}

			});

			this._structureReady = true;
			if(this._profilDescription != null) {
				this.buildClientContent();
			}
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
		if(this._structureReady && this._profilDescription != null) {
			this._profilDescription.zoneContents.forEach(function(zoneContentDescription : any) {
				var zone = self._retrieveZone(zoneContentDescription.zone.id);

				if(zoneContentDescription.relativeTimeline != null) {
					var relativeTimelineDescription = zoneContentDescription.relativeTimeline;

					var newRelTimeline : RelativeTimeline = new RelativeTimeline(relativeTimelineDescription.id);
					newRelTimeline.setBehaviour(zone.getBehaviour());

					if (window[relativeTimelineDescription.timelineRunner["name"]]) {
						var timelineRunner = new window[relativeTimelineDescription.timelineRunner["name"]]();
						newRelTimeline.setTimelineRunner(timelineRunner);
					} else {
						Logger.error("TimelineRunner '" + relativeTimelineDescription.timelineRunner["name"] + "' was not found.");
					}

					var systemTrigger : any = null;
					if (window[relativeTimelineDescription.systemTrigger["name"]]) {
						systemTrigger = new window[relativeTimelineDescription.systemTrigger["name"]]();
						newRelTimeline.setSystemTrigger(systemTrigger);
					} else {
						Logger.error("SystemTrigger '" + relativeTimelineDescription.systemTrigger["name"] + "' was not found.");
					}

					var userTrigger : any = null;
					if (window[relativeTimelineDescription.userTrigger["name"]]) {
						userTrigger = new window[relativeTimelineDescription.userTrigger["name"]]();
						newRelTimeline.setUserTrigger(userTrigger);
					} else {
						Logger.error("UserTrigger '" + relativeTimelineDescription.userTrigger["name"] + "' was not found.");
					}

					relativeTimelineDescription.relativeEvents.forEach(function(relativeEventDescription : any) {
						var newRelEvent : RelativeEvent = new RelativeEvent(relativeEventDescription.id, relativeEventDescription.position, relativeEventDescription.duration);

						var callDescription = relativeEventDescription.call;
						var newCall : Call = new Call(callDescription.id);

						var callType : CallType = self._retrieveCallType(callDescription.callType.id);
						newCall.setCallType(callType);

						if (callType.getStaticSourceName() != null) {

							var params = [];

							callDescription.paramValues.forEach(function(paramValue : any) {
								params[paramValue.paramType.name] = paramValue.value;
							});

							var staticSource = new window[callType.getStaticSourceName()](callType.getStaticRefreshTime(), params);
							newCall.setStaticSource(staticSource);
						}

						if(systemTrigger != null) {
							newCall.setSystemTrigger(systemTrigger);
						}

						newRelEvent.setCall(newCall);

						newRelTimeline.addRelativeEvent(newRelEvent);
					});

					zone.setRelativeTimeline(newRelTimeline);
				} else if(zoneContentDescription.absoluteTimeline != null) {
					//TODO
				} else {
					Logger.error("Error in ZoneContent description with '" + zoneContentDescription.id + "' : missing a widget or relative timeline or absolute timeline.");
				}
			});

			this.start();
		}
	}

	/**
	 * Step 3 : Start Client !
	 *
	 */
	start() {
//        Logger.debug("3 - start");

		//Not need by less compilation. $('head').append('<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/2.3.1/less.min.js"></script>');

		this._zones.forEach(function(zone : Zone) {
			zone.start();
		});

		setTimeout(function() {
			$('#logo_loading').fadeOut(1000);
		}, 2000);
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