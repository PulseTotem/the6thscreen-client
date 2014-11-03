/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../t6s-core/core-client/scripts/core/ForEachAsync.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Call.ts" />
/// <reference path="./CallTypeDescription.ts" />

declare var io: any; // Use of Socket.IO lib

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
     * Constructor.
     *
     * @constructor
     * @param {string} backendURL - The Backend's URL.
     */
    constructor(backendURL : string) {
        this._backendURL = backendURL;
        this._zones = new Array();
        this._callTypeDescriptions = new Array<CallTypeDescription>();
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

        this._backendSocket = io(this._backendURL + "/clients");
        this._backendSocket.on("connect", function() {
            Logger.info("Connected to Backend.");
            self.listen();
            self.init();
        });

        this._backendSocket.on("error", function(errorData) {
            Logger.error("An error occurred during connection to Backend.");
            Logger.debug(errorData);
        });

        this._backendSocket.on("disconnect", function() {
            Logger.info("Disconnected to Backend.");
        });

        this._backendSocket.on("reconnect", function(attemptNumber) {
            Logger.info("Connected to Backend after " + attemptNumber + " attempts.");
            self.init();
        });

        this._backendSocket.on("reconnect_attempt", function() {
            //TODO?
        });

        this._backendSocket.on("reconnecting", function(attemptNumber) {
            Logger.info("Trying to connect to Backend - Attempt number " + attemptNumber + ".");
        });

        this._backendSocket.on("reconnect_error", function(errorData) {
            Logger.error("An error occurred during reconnection to Backend.");
            Logger.debug(errorData);
        });

        this._backendSocket.on("reconnect_failed", function() {
            Logger.error("Failed to connect to Backend. No new attempt will be done.");
        });
    }

    /**
     * Step 0 : Listen for Backend answers.
     *
     * @method listen
     */
    listen() {
        var self = this;

        this._backendSocket.on("ProfilDescription", function(profilDescription) {
            self.profilDescriptionProcess(profilDescription);
        });

        this._backendSocket.on("UserDescription", function(userDescription) {
            Logger.debug(userDescription);
            self.checkSDIOwner(userDescription);
        });

        this._backendSocket.on("SDIDescription", function(sdiDescription) {
            Logger.debug(sdiDescription);
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
     * Build the client step by step.
     * Step 1 : Retrieving SDI Information.
     *
     * @method init
     */
    init() {
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
            } else {
                this._profilId = profil;
                // Check SDI Owner
                this._backendSocket.emit("RetrieveUserDescription", {"userId" : this._userId});
            }
        } else {
            Logger.error("The 6th Screen Client's URL is not correct : Missing parameters");
        }
    }

    /**
     * Step 1.1 : Check if user is SDI's owner.
     *
     * @method checkSDIOwner
     * @param {JSON Object} userDescription - The user's description to process
     */
    checkSDIOwner(userDescription : any) {
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
            // TODO: Exception ? Gestion de l'erreur ?
        }
    }

    /**
     * Step 1.2 : Check if profil exists for SDI in param.
     *
     * @method isProfilExist
     * @param {JSON Object} sdiDescription - The SDI's description to process
     */
    isProfilExist(sdiDescription : any) {
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
            ForEachAsync.forEach(sdiDescription.zones, function(iZone) {
                var zoneInfo = sdiDescription.zones[iZone];
                self._backendSocket.emit("RetrieveZoneDescription", {"zoneId": zoneInfo.id});
            });
            self._backendSocket.emit("RetrieveProfilDescription", {"profilId": self._profilId});
        } else {
            // TODO: Exception ? Gestion de l'erreur ?
        }
    }

    /**
     * Step 1.3 : Process the Zone Description
     *
     * @method zoneDescriptionProcess
     * @param {JSON Object} zoneDescription - The zone's description to process
     */
    zoneDescriptionProcess(zoneDescription : any) {
        var self = this;
        Logger.debug(zoneDescription);
        var newZone:Zone = new Zone(zoneDescription.id, zoneDescription.name, zoneDescription.description, zoneDescription.width, zoneDescription.height, zoneDescription.positionFromTop, zoneDescription.positionFromLeft);
        self._zones.push(newZone);
        // TODO : Manage Behaviour
    }

    /**
     * Step 2 : Process the Profil Description
     *
     * @method profilDescriptionProcess
     * @param {JSON Object} profilDescription - The profil's description to process
     */
    profilDescriptionProcess(profilDescription : any) {
        var self = this;
        Logger.debug(profilDescription);
        if(typeof(profilDescription.calls) != "undefined") {
            ForEachAsync.forEach(profilDescription.calls, function(iCall) {
                var callDescription = profilDescription.calls[iCall];
                var callId = callDescription["id"];
                self._backendSocket.emit("RetrieveCallDescription", {"callId" : callId});
            });
        }
    }

    /**
     * Step 3.0 : Process the Call Description
     *
     * @method callDescriptionProcess
     * @param {JSON Object} callDescription - The call's description to process
     */
    callDescriptionProcess(callDescription : any) {
        var self = this;
        Logger.debug(callDescription);
        if(typeof(callDescription.callType) != "undefined") {
            var callTypeId = callDescription.callType["id"];
            var callTypeDesc = this.retrieveCallTypeDescription(callTypeId);

            if(callTypeDesc == null) {
                callTypeDesc = new CallTypeDescription(callTypeId);
                callTypeDesc.addCallId(callDescription.id);
                this._callTypeDescriptions.push(callTypeDesc);
                this._backendSocket.emit("RetrieveCallTypeDescription", {"callTypeId" : callTypeId});
            } else {
                callTypeDesc.addCallId(callDescription.id);
                if(callTypeDesc.getDescription() != null) {
                    this.callTypeDescriptionProcess(callTypeDesc.getDescription());
                }
            }
        }
    }

    /**
     * Step 3.0.1 : Check existing CallType Descriptions;
     *
     * @method retrieveCallTypeDescription
     * @param {number} callTypeId - The CallType's Id to find.
     */
    retrieveCallTypeDescription(callTypeId : number) {
        for(var iCallType in this._callTypeDescriptions) {
            var callTypeDesc = this._callTypeDescriptions[iCallType];
            if(callTypeDesc.getId() == callTypeId) {
                return callTypeDesc;
            }
        }

        return null;
    }

    /**
     * Step 3.1 : Process the CallType Description
     *
     * @method callTypeDescriptionProcess
     * @param {JSON Object} callTypeDescription - The callType's description to process
     */
    callTypeDescriptionProcess(callTypeDescription : any) {
        var self = this;

        var callTypeId = parseInt(callTypeDescription.id);

        var calltypeDesc = this.retrieveCallTypeDescription(callTypeId);

        if(calltypeDesc.getDescription() == null) {
            calltypeDesc.setDescription(callTypeDescription);
        }

        Logger.debug(callTypeDescription);

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
            var zone = this.retrieveZone(zoneId);
            if(zone != null) {
                var callIds = calltypeDesc.getCallIds();
                for(var iCallId in callIds) {
                    var callId = callIds[iCallId];
                    var call = zone.retrieveCall(callId);

                    if (call == null) {
                        call = new Call(callId, zone);

                        //TODO : Manage Renderer, RenderPolicy etc... with 'path' loading //Objet window[functionName]()

                        if (window[callTypeDescription.renderer["name"]]) {
                            var renderer = new window[callTypeDescription.renderer["name"]]();
                            call.setRenderer(renderer);
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
            } else {
                // TODO: Exception ? Gestion de l'erreur ?
            }
        } else {
            // TODO: Exception ? Gestion de l'erreur ?
        }
    }

    /**
     * Retrieve Zone from its Id.
     *
     * @method retrieveZone
     * @private
     * @param {number} zoneId - The Zone's Id.
     * @returns {Zone} the Zone corresponding to zoneId.
     */
    private retrieveZone(zoneId : number) : Zone {
        for(var iZone in this._zones) {
            var zone = this._zones[iZone];
            if(zone.getId() == zoneId) {
                return zone;
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
     * @returns {string} value of query variable.
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
        Logger.warn('Query Variable ' + variable + ' not found');
        return "";
    }

}