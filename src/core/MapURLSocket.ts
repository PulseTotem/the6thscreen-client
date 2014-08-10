/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

class MapURLSocket {
    URL : string;
    socket : any;

    constructor(URL : string, socket : any) {
        this.URL = URL;
        this.socket = socket;
    }
}