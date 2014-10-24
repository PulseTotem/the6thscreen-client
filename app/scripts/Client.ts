/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../t6s-core/core-client/scripts/core/ForEachAsync.ts" />
/// <reference path="./Zone.ts" />
/// <reference path="./Call.ts" />

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
     * Constructor.
     *
     * @constructor
     * @param {string} backendURL - The Backend's URL.
     */
    constructor(backendURL : string) {
        this._backendURL = backendURL;
        this._zones = new Array();
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

        this._backendSocket.on("CallTypeDescriptionWithCallId", function(callTypeDescriptionWithCallId) {
            self.callTypeDescriptionWithCallIdProcess(callTypeDescriptionWithCallId);
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
            this._backendSocket.emit("RetrieveCallTypeDescriptionWithCallId", {"callTypeId" : callTypeId, "callId" : callDescription.id});
        }
    }

    /**
     * Step 3.1 : Process the CallType Description WithCallId
     *
     * @method callTypeDescriptionWithCallIdProcess
     * @param {JSON Object} callTypeDescriptionWithCallId - The callType's description with CallId to process
     */
    callTypeDescriptionWithCallIdProcess(callTypeDescriptionWithCallId : any) {
        var self = this;

        var callId = parseInt(callTypeDescriptionWithCallId.callId);

        Logger.debug(callTypeDescriptionWithCallId);

        var rendererId = null;

        if(typeof(callTypeDescriptionWithCallId.renderer) != "undefined") {
            rendererId = callTypeDescriptionWithCallId.renderer["id"];
        }

        var zoneId = null;

        if(typeof(callTypeDescriptionWithCallId.zone) != "undefined") {
            zoneId = callTypeDescriptionWithCallId.zone["id"];
        }

        var receivePolicyId = null;

        if(typeof(callTypeDescriptionWithCallId.receivePolicy) != "undefined") {
            receivePolicyId = callTypeDescriptionWithCallId.receivePolicy["id"];
        }

        var renderPolicyId = null;

        if(typeof(callTypeDescriptionWithCallId.renderPolicy) != "undefined") {
            renderPolicyId = callTypeDescriptionWithCallId.renderPolicy["id"];
        }

        if(rendererId != null && zoneId != null && receivePolicyId != null && renderPolicyId != null) {
            var zone = this.retrieveZone(zoneId);
            if(zone != null) {
                var call = new Call(callId, zone);

                //TODO : Manage Renderer, RenderPolicy etc... //Objet window[nomFonction]()

                zone.addCall(call);
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