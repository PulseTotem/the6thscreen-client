/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="./Logger.ts" />
/// <reference path="./Zone.ts" />

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
            this._backendSocket.on("ProfilDescription", function(profilDescription) {
                //profilDescription - {"test" : string}
                self.profilDescriptionProcess(profilDescription);
            });
            if(timeline != "") {
                // TODO : Treat timeline by retrieve all profils' description in timeline and display only the current.
            } else {
                this._backendSocket.emit("RetrieveProfilDescription", {"userId" : user, "sdiId" : sdi, "profilId" : profil});
            }
        } else {
            Logger.error("The 6th Screen Client's URL is not correct : Missing parameters");
        }
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
            for(var iCall in profilDescription.calls) {
                var callDescription = profilDescription.calls[iCall];
                var callId = callDescription["id"];
                this._backendSocket.on("CallDescription", function(callDescriptionProcess) {
                    self.callDescriptionProcess(callDescriptionProcess);
                });
                this._backendSocket.emit("RetrieveCallDescription", {"callId" : callId});
            }
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
            this._backendSocket.on("CallTypeDescription", function(callDescriptionProcess) {
                self.callTypeDescriptionProcess(callDescriptionProcess);
            });
            this._backendSocket.emit("RetrieveCallTypeDescription", {"callTypeId" : callTypeId});
        }

        if(typeof(callDescription.paramValues) != "undefined") {
            for(var iPV in callDescription.paramValues) {
                var pvDescription = callDescription.paramValues[iPV];
                var pvId = pvDescription["id"];
                //TODO En faire quelque chose...
            }
        }
    }

    /**
     * Step 3.1 : Process the CallType Description
     *
     * @method callTypeDescriptionProcess
     * @param {JSON Object} callTypeDescription - The callType's description to process
     */
    callTypeDescriptionProcess(callTypeDescription : any) {
        var self = this;
        Logger.debug(callTypeDescription);

        //this._zones

        if(typeof(callTypeDescription.source) != "undefined") {
            var sourceId = callTypeDescription.source["id"];
            //TODO En faire quelque chose...
        }

        if(typeof(callTypeDescription.renderer) != "undefined") {
            var rendererId = callTypeDescription.renderer["id"];
            //TODO En faire quelque chose...
        }

        if(typeof(callTypeDescription.zone) != "undefined") {
            var zoneId = callTypeDescription.zone["id"];
            //TODO En faire quelque chose...
        }

        if(typeof(callTypeDescription.receivePolicy) != "undefined") {
            var receivePolicyId = callTypeDescription.receivePolicy["id"];
            //TODO En faire quelque chose...
        }

        if(typeof(callTypeDescription.renderPolicy) != "undefined") {
            var renderPolicyId = callTypeDescription.renderPolicy["id"];
            //TODO En faire quelque chose...
        }
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