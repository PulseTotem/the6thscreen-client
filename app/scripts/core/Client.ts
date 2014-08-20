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
     * Constructor.
     *
     * @constructor
     * @param {string} backendURL - The Backend's URL.
     */
    constructor(backendURL : string) {
        this._backendURL = backendURL;
    }

    /**
     * To run the client.
     */
    run() {
        Logger.info("The 6th Screen Client runs !");

        this._backendSocket = io(this._backendURL);
        this._backendSocket.on("", function(data) {
          //TODO Retrieve all calls description from Customizer.
        });

        var user = this.getQueryVariable("user");
        var sdi = this.getQueryVariable("sdi");
        var timeline = this.getQueryVariable("tl");

        if(user != "" && sdi != "" && timeline != "") {

        }
    }

    /**
     * Analyzes search query in location address and
     * returns value for searched variable.
     *
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
        Logger.error('Query Variable ' + variable + ' not found');
        return "";
    }

}