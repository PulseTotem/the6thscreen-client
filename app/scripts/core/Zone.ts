/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="./Call.ts" />
/// <reference path="./MapURLSocket.ts" />
/// <reference path="./Logger.ts" />
/// <reference path="../behaviour/Behaviour.ts" />

declare var io: any; // Use of Socket.IO lib

/**
 * Represents a Zone of The6thScreen Client.
 *
 * @class Zone
 */
class Zone {

    var data = {
    "id": this.getId(),
    "name": this.name(),
    "description": this.description(),
    "width": this.width(),
    "height": this.height(),
    "positionFromTop": this.positionFromTop(),
    "positionFromLeft": this.positionFromLeft()
};

    /**
     * Zone's name.
     *
     * @property _name
     * @type string
     */
    private _name : string;

    /**
     * Zone's description.
     *
     * @property _description
     * @type string
     */
    private _description : string;

    /**
     * Zone's width.
     *
     * @property _width
     * @type number
     */
    private _width : number;

    /**
     * Zone's height.
     *
     * @property _height
     * @type number
     */
    private _height : number;

    /**
     * Zone's positionFromTop.
     *
     * @property _positionFromTop
     * @type number
     */
    private _positionFromTop : number;

    /**
     * Zone's positionFromLeft.
     *
     * @property _positionFromLeft
     * @type number
     */
    private _positionFromLeft : number;

    /**
     * The 6th Screen Sources Servers' connections.
     *
     * @property _sourcesServersConnections
     * @type Array<MapURLSocket>
     */
    private _sourcesServersConnections : Array<MapURLSocket>;

    /**
     * The 6th Screen Customizer's URL.
     *
     * @property _customizerURL
     * @type string
     * /
    private _customizerURL : string;

    /**
     * The 6th Screen Customizer's socket.
     *
     * @property _customizerSocket
     * @type any
     * /
    private _customizerSocket : any;
*/

    /**
     * List of Calls' Zone
     *
     * @property _calls
     * @type Array<Call>
     */
    private _calls : Array<Call>;

    /**
     * Behaviour attached to Zone.
     *
     * @property _behaviour
     * @type Behaviour
     */
    private _behaviour : Behaviour;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - The Zone's name.
     * @param {string} description - The Zone's description.
     * @param {number} width - The Zone's width.
     * @param {number} height - The Zone's height.
     * @param {number} positionFromTop - The Zone's positionFromTop.
     * @param {number} positionFromLeft - The Zone's positionFromLeft.
     */
    constructor(name : string, description: string, width: number, height: number, positionFromTop: number, positionFromLeft: number) {
        this._name = name;
        this._description = description;
        this._width = width;
        this._height = height;
        this._positionFromTop = positionFromTop;
        this._positionFromLeft = positionFromLeft;

        this._calls = new Array<Call>();
        this._behaviour = new Behaviour();
        this._sourcesServersConnections = new Array<MapURLSocket>();
//        this._connectToCustomizer();
    }

    /**
     * Connect to The6thScreen Customizer.
     *
     * @method _connectToCustomizer
     * @private
     * /
    private _connectToCustomizer() {
        //this._customizerSocket = io(this._customizerURL);
        //this._customizerSocket.on("", function(data) {
        //  //TODO Retrieve all calls description from Customizer.
        //});
        this._manageCalls();
    }*/

    /**
     * Create calls and init them.
     *
     * @method _manageCalls
     * @private
     */
    private _manageCalls() {
        // TODO Loop on Calls description and build calls list.

        //to test
        var host = "localhost";
        var port = "4000";
        var callId = "1";
        var hash = "42";

        // callDescription : {id : string, host : string, port : string, hash}
        var sourcesServerURL : string = "http://" + host + ":" + port;
        var socketConnection : any = this._retrieveSocket(sourcesServerURL);
        if(socketConnection == null) {
            socketConnection = this._connectToSourcesServer(sourcesServerURL);
            if(socketConnection != null) {
                this._sourcesServersConnections.push(new MapURLSocket(sourcesServerURL, socketConnection));
            }
        }
        this._calls.push(new Call(callId, hash, this._name, socketConnection));
    }

    /**
     * Retrieve a socket from its URL if a previous connection was done.
     *
     * @method _retrieveSocket
     * @private
     * @param {string} URL - The Sources Server's URL
     */
    private _retrieveSocket(URL : string) {
        this._sourcesServersConnections.forEach(function(elem) {
            if(elem.URL == URL) {
                return elem.socket;
            }
        });
        return null;
    }

    /**
     * Connect to The6thScreen Sources' Server.
     *
     * @method _connectToSourcesServer
     * @private
     * @param {string} sourcesServerURL - The Sources Server's URL.
     */
    private _connectToSourcesServer(sourcesServerURL : string) {
        try {
            var sourcesServerSocket = io(sourcesServerURL);
            Logger.info("Zone - Connection to Sources Server done.");
            sourcesServerSocket.emit("zones/newZone", {"name" : this._name});
            Logger.info("Zone - Zone declaration done.");
            return sourcesServerSocket;
        } catch(e) {
            Logger.error("Zone - Connection to Sources Server failed !");
            Logger.debug(e.message);
            return null;
        }
    }
}