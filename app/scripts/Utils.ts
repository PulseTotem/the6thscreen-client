/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/**
 * Utils class : Use to keep together some useful methods.
 *
 * @class Utils
 */
class Utils {

    /**
     * Method to manage response from Server (Backend or SourcesServer).
     *
     * @method manageServerResponse
     * @static
     * @param {any} response - The response from Server Socket.
     * @param {Function} successCB - The callback function for success response.
     * @param {Function} failCB - The callback function for fail response.
     */
    static manageServerResponse(response : any, successCB : Function, failCB : Function) {
        if(!!response.success && !!response.response) {
            if(response.success) {
                successCB(response.response);
            } else {
                failCB(response.response);
            }
        } else {
            failCB(new Error("Server response is not well formatted."));
        }
    }
}