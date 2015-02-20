/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../t6s-core/core-client/scripts/core/ForEachAsync.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./CallTypeDescription.ts" />

declare var io: any; // Use of Socket.IO lib
declare var $: any; // Use of JQuery

class Client {

    /**
     * The 6th Screen Backend's URL.
     *
     * @property _backendURL
     * @type string
     */
    private _backendURL : string;

    /**
     * The 6th Screen Backend's socket.
     *
     * @property _backendSocket
     * @type any
     */
    private _backendSocket : any;

    /**
     * The Client's ProfilID.
     *
     * @property _profilId
     * @type string
     */
    private _profilId : string;

    /**
     * The Client's UserID.
     *
     * @property _userId
     * @type string
     */
    private _userId : string;

    /**
     * The Client's SDIId.
     *
     * @property _sdiId
     * @type string
     */
    private _sdiId : string;

    /**
     * The Client's Zones.
     *
     * @property _zones
     * @type Array<any>
     */
    private _zones : any;

    /**
     * The Client's CallType Descriptions.
     *
     * @property _callTypeDescriptions
     * @type Array<CallTypeDescription>
     */
    private _callTypeDescriptions : Array<CallTypeDescription>;

    /**
     * The Client's CallIds.
     *
     * @property _callIds
     * @type Array<number>
     */
    private _callIds : Array<number>;

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
     * @param {string} backendURL - The Backend's URL.
     */
    constructor(backendURL : string) {
        this._backendURL = backendURL;
        this._zones = new Array();
        this._callTypeDescriptions = new Array<CallTypeDescription>();
        this._callIds = new Array<number>();

        this._sdiDescription = null;
        this._profilDescription = null;
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

        this._backendSocket = io(this._backendURL + "/clients",
            {"reconnection" : true, 'reconnectionAttempts' : 10, "reconnectionDelay" : 1000, "reconnectionDelayMax" : 5000, "timeout" : 5000, "autoConnect" : true});

        this.listen();

        this._backendSocket.on("connect", function() {
            Logger.info("Connected to Backend.");
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
     * Step 0 : Listen for Backend answers.
     *
     * @method listen
     */
    listen() {
        Logger.debug("0 - listen");
        var self = this;

        this._backendSocket.on("ProfilDescription", function(profilDescription) {
            self.profilDescriptionProcess(profilDescription);
        });

        this._backendSocket.on("UserDescription", function(userDescription) {
            self.checkSDIOwner(userDescription);
        });

        this._backendSocket.on("SDIDescription", function(sdiDescription) {
            self.isProfilExist(sdiDescription);
        });

        this._backendSocket.on("ZoneDescription", function(zoneDescription) {
            self.zoneDescriptionProcess(zoneDescription);
        });

        this._backendSocket.on("CallDescription", function(callDescriptionProcess) {
            self.callDescriptionProcess(callDescriptionProcess);
        });

        this._backendSocket.on("CallTypeDescription", function(callTypeDescription) {
            self.callTypeDescriptionProcess(callTypeDescription);
        });
    }

    /**
     * Manage connection with backend.
     *
     * @method manageBackendConnection
     */
    manageBackendConnection() {
        var self = this;

        if(this._sdiDescription == null) {
            this.init();
        } else { // Step 1.* : done
            if(this._sdiDescription.zones.length != this._zones.length) {
                this.retrieveZones();
            } else { // Step 2.* : done
                if (this._profilDescription == null) {
                    this.retrieveProfil();
                } else { // Step 3.1 : Done
                    if(typeof(this._profilDescription.calls) != "undefined") {
                        if(this._profilDescription.calls.length != this._callIds.length) {
                            this.profilDescriptionProcess(this._profilDescription);
                        } else { // Step 3.2 && 3.3 : Done
                            ForEachAsync.forEach(this._callTypeDescriptions, function(iCallType) {
                                var callTypeDesc = this._callTypeDescriptions[iCallType];
                                if(callTypeDesc.getDescription() == null) {
                                    var callTypeId = callTypeDesc.getId();
                                    self.retrieveCallType(callTypeId);
                                } else { // Step 3.4 : Done
                                    self.callTypeDescriptionProcess(callTypeDesc.getDescription()); // Step 3.5 : Done for all.
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    /**
     * Build the client step by step.
     * Step 1.1 : Retrieving SDI Information.
     *
     * @method init
     */
    init() {
        Logger.debug("1.1 - init");
        var self = this;

        var user = this.getQueryVariable("user");
        var sdi = this.getQueryVariable("sdi");
        var timeline = this.getQueryVariable("tl");
        var profil = this.getQueryVariable("p");

        if(user != "" && sdi != "" && (timeline != "" || profil != "")) {
            this._userId = user;
            this._sdiId = sdi;

            if(timeline != "") {
                // TODO : Treat timeline by retrieve all profils' description in timeline and display only the current.
                Logger.warn("Timeline is not yet available.");
            } else {
                this._profilId = profil;
                // Check SDI Owner
                this._backendSocket.emit("RetrieveUserDescription", {"userId" : this._userId});
            }
        } else {
            Logger.error("The 6th Screen Client's URL is not correct : Missing parameters.");
        }
    }

    /**
     * Step 1.2 : Check if user is SDI's owner.
     *
     * @method checkSDIOwner
     * @param {JSON Object} userDescription - The user's description to process
     */
    checkSDIOwner(userDescription : any) {
        Logger.debug("1.2 - checkSDIOwner");
        var self = this;

        var checkOK = false;
        for(var iSDI in userDescription.sdis) {
            var sdiInfo = userDescription.sdis[iSDI];

            if(sdiInfo.id == self._sdiId) {
                checkOK = true;
                break;
            }
        }

        if(checkOK) {
            //Check if profil exists
            this._backendSocket.emit("RetrieveSDIDescription", {"sdiId" : this._sdiId});
        } else {
            Logger.error("User is not SDI Owner.");
        }
    }

    /**
     * Step 1.3 : Check if profil exists for SDI in param.
     *
     * @method isProfilExist
     * @param {JSON Object} sdiDescription - The SDI's description to process
     */
    isProfilExist(sdiDescription : any) {
        this._sdiDescription = sdiDescription;
        Logger.debug("1.3 - isProfilExist");
        var self = this;

        var checkOK = false;
        for(var iProfil in sdiDescription.profils) {
            var profilInfo = sdiDescription.profils[iProfil];

            if(profilInfo.id == self._profilId) {
                checkOK = true;
                break;
            }
        }

        if(checkOK) {
            //TODO : Manage SDI theme !
                $('head').append('<link rel="stylesheet/less" type="text/less" href="static/themes/basic.less" />');
            //TODO : Manage SDI theme !
            this.retrieveZones();
        } else {
            Logger.error("Profil doesn't belong to this SDI.");
        }
    }

    /**
     * Step 2.1 Initialization : Retrieve all zones descriptions
     *
     * @method retrieveZones
     */
    retrieveZones() {
        Logger.debug("2.1 - retrieveZones");
        var self = this;

        ForEachAsync.forEach(this._sdiDescription.zones, function(iZone) {
            var zoneInfo = self._sdiDescription.zones[iZone];
            if(self.getZone(zoneInfo.id) == null) {
                self._backendSocket.emit("RetrieveZoneDescription", {"zoneId": zoneInfo.id});
            }
        });
    }

    /**
     * Step 2.2 : Process the Zone Description
     *
     * @method zoneDescriptionProcess
     * @param {JSON Object} zoneDescription - The zone's description to process
     */
    zoneDescriptionProcess(zoneDescription : any) {
        Logger.debug("2.2 - zoneDescriptionProcess");
        var self = this;
        var newZone:Zone = new Zone(zoneDescription.id, zoneDescription.name, zoneDescription.description, zoneDescription.width, zoneDescription.height, zoneDescription.positionFromTop, zoneDescription.positionFromLeft);

        if(window[zoneDescription.behaviour["name"]]) {
            var behaviour = new window[zoneDescription.behaviour["name"]]();
            newZone.setBehaviour(behaviour);
        }

        self._zones.push(newZone);

        if(self._sdiDescription.zones.length == self._zones.length) {
            self.retrieveProfil();
        }
    }

    /**
     * Step 3.1 Initialization : Retrieve profil description
     *
     * @method retrieveProfil
     */
    retrieveProfil() {
        Logger.debug("3.1 - retrieveProfil");
        this._backendSocket.emit("RetrieveProfilDescription", {"profilId": this._profilId});
    }

    /**
     * Step 3.2 : Process the Profil Description
     *
     * @method profilDescriptionProcess
     * @param {JSON Object} profilDescription - The profil's description to process
     */
    profilDescriptionProcess(profilDescription : any) {
        Logger.debug("3.2 - profilDescriptionProcess");
        this._profilDescription = profilDescription;
        var self = this;
        if(typeof(profilDescription.calls) != "undefined") {
            ForEachAsync.forEach(profilDescription.calls, function(iCall) {
                var callDescription = profilDescription.calls[iCall];
                var callId = callDescription["id"];
                if(self._callIds.indexOf(callId) == -1) {
                    self._backendSocket.emit("RetrieveCallDescription", {"callId": callId});
                }
            });
        }
    }

    /**
     * Step 3.3 : Process the Call Description
     *
     * @method callDescriptionProcess
     * @param {JSON Object} callDescription - The call's description to process
     */
    callDescriptionProcess(callDescription : any) {
        Logger.debug("3.3 - callDescriptionProcess");
        var self = this;
        if(typeof(callDescription.callType) != "undefined") {
            var callTypeId = callDescription.callType["id"];
            var callTypeDesc = this.getCallTypeDescription(callTypeId);

            if(callTypeDesc == null) {
                callTypeDesc = new CallTypeDescription(callTypeId);
                callTypeDesc.addCallId(callDescription.id);
                this._callTypeDescriptions.push(callTypeDesc);

                this.retrieveCallType(callTypeId);
            } else {
                callTypeDesc.addCallId(callDescription.id);
                if(callTypeDesc.getDescription() != null) {
                    this.callTypeDescriptionProcess(callTypeDesc.getDescription());
                }
            }

            this._callIds.push(callDescription.id);
        }
    }

    /**
     * Step 3.4 Initialization : Retrieve CallType description
     *
     * @method retrieveCallType
     * @param {number} callTypeId - The CallType's Id.
     */
    retrieveCallType(callTypeId : number) {
        Logger.debug("3.4 - retrieveCallType");
        this._backendSocket.emit("RetrieveCallTypeDescription", {"callTypeId" : callTypeId});
    }

    /**
     * Step 3.5 : Process the CallType Description
     *
     * @method callTypeDescriptionProcess
     * @param {JSON Object} callTypeDescription - The callType's description to process
     */
    callTypeDescriptionProcess(callTypeDescription : any) {
        Logger.debug("3.5 - callTypeDescriptionProcess");
        var self = this;

        var callTypeId = parseInt(callTypeDescription.id);

        var calltypeDesc = this.getCallTypeDescription(callTypeId);

        if(calltypeDesc.getDescription() == null) {
            calltypeDesc.setDescription(callTypeDescription);
        }

        var rendererId = null;

        if(typeof(callTypeDescription.renderer) != "undefined") {
            rendererId = callTypeDescription.renderer["id"];
        }

        var zoneId = null;

        if(typeof(callTypeDescription.zone) != "undefined") {
            zoneId = callTypeDescription.zone["id"];
        }

        var receivePolicyId = null;

        if(typeof(callTypeDescription.receivePolicy) != "undefined") {
            receivePolicyId = callTypeDescription.receivePolicy["id"];
        }

        var renderPolicyId = null;

        if(typeof(callTypeDescription.renderPolicy) != "undefined") {
            renderPolicyId = callTypeDescription.renderPolicy["id"];
        }

        if(rendererId != null && zoneId != null && receivePolicyId != null && renderPolicyId != null) {
            var zone = this.getZone(zoneId);
            if(zone != null) {
                var callIds = calltypeDesc.getCallIds();
                for(var iCallId in callIds) {
                    var callId = callIds[iCallId];
                    var call = zone.retrieveCall(callId);

                    if (call == null) {
                        call = new Call(callId, zone);

                        if (window[callTypeDescription.renderer["name"]]) {
                            var renderer = new window[callTypeDescription.renderer["name"]]();
                            call.setRenderer(renderer);
                            $('head').append('<link rel="stylesheet/less" type="text/less" href="static/renderers/' + callTypeDescription.renderer["name"] + '.less" />');
                        }

                        if (window[callTypeDescription.renderPolicy["name"]]) {
                            var renderPolicy = new window[callTypeDescription.renderPolicy["name"]]();
                            call.setRenderPolicy(renderPolicy);
                        }

                        if (window[callTypeDescription.receivePolicy["name"]]) {
                            var receivePolicy = new window[callTypeDescription.receivePolicy["name"]]();
                            call.setReceivePolicy(receivePolicy);
                        }


                        zone.addCall(call);
                    }
                }


                if(this.getNumberOfCalls() == this._profilDescription.calls.length) {
                    $('head').append('<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/2.3.1/less.min.js"></script>');
                }

            } else {
                Logger.error("SDI or Profil definition error : A zone is not defined or does'nt belong to the good SDI...");
            }
        } else {
            Logger.error("SDI or Profil definition error : Missing information about Zone, Renderer, RenderPolicy or ReceivePolicy.");
        }
    }

    /**
     * Stop behaviour of specific zone.
     *
     * @method stopBehaviourForZone
     * @param {Zone} zone - The zone to stop its behaviour
     */
    stopBehaviourForZone(zone : Zone) {
        if(zone != null) {
            zone.stopBehaviour();
        } else {
            Logger.warn("Stop behaviour of null zone isn't possible.");
        }
    }

    /**
     * Stop behaviour for all zones.
     *
     * @method stopAllBehaviours
     */
    stopAllBehaviours() {
        for(var iZone in this._zones) {
            var zone = this._zones[iZone];
            Logger.debug("Stop behavior for zone with id : " + zone.getId() + " and with index in array : " + iZone);
            zone.stopBehaviour();
        }
    }

    /**
     * Restart behaviour of specific zone.
     *
     * @method restartBehaviourForZone
     * @param {Zone} zone - The zone to stop its behaviour
     */
    restartBehaviourForZone(zone : Zone) {
        if(zone != null) {
            zone.restartBehaviour();
        } else {
            Logger.warn("Restart behaviour of null zone isn't possible.");
        }
    }

    /**
     * Restart behaviour for all zones.
     *
     * @method restartAllBehaviours
     */
    restartAllBehaviours() {
        for(var iZone in this._zones) {
            var zone = this._zones[iZone];
            Logger.debug("Restart behavior for zone with id : " + zone.getId() + " and with index in array : " + iZone);
            zone.restartBehaviour();
        }
    }

    /**
     * Retrieve number of Calls in all zones.
     *
     * @method getNumberOfCalls
     * @private
     * @returns {number} the number of calls in all zones.
     */
    private getNumberOfCalls() : number {
        var total : number = 0;
        for(var iZone in this._zones) {
            var zone = this._zones[iZone];
            total += zone.getCalls().length;
        }

        return total;
    }

    /**
     * Retrieve Zone from its Id.
     *
     * @method getZone
     * @private
     * @param {number} zoneId - The Zone's Id.
     * @returns {Zone} the Zone corresponding to zoneId or null.
     */
    private getZone(zoneId : number) : Zone {
        for(var iZone in this._zones) {
            var zone = this._zones[iZone];
            if(zone.getId() == zoneId) {
                return zone;
            }
        }

        return null;
    }

    /**
     * Check existing CallType Descriptions;
     *
     * @method getCallTypeDescription
     * @private
     * @param {number} callTypeId - The CallType's Id to find.
     * @returns {CallTypeDescription} The CallTypeDescription corresponding to CallTypeId or null
     */
    private getCallTypeDescription(callTypeId : number) : CallTypeDescription {
        for(var iCallType in this._callTypeDescriptions) {
            var callTypeDesc = this._callTypeDescriptions[iCallType];
            if(callTypeDesc.getId() == callTypeId) {
                return callTypeDesc;
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