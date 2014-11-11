/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

class CallTypeDescription {

    /**
     * CallType's id.
     *
     * @property _id
     * @type number
     */
    private _id : number;

    /**
     * CallId List.
     *
     * @property _callIds
     * @type Array<number>
     */
    private _callIds : Array<number>;

    /**
     * CallType's description.
     *
     * @property _description
     * @type any
     */
    private _description : any;

    /**
     * Constructor.
     *
     * @constructor
     * @param {number} id - The CallType's id.
     */
    constructor(id : number) {
        this._id = id;
        this._description = null;
        this._callIds = new Array<number>();
    }

    /**
     * Returns CallType's Id.
     *
     * @method getId
     * @return {number} The callType's Id.
     */
    getId() : number {
        return this._id;
    }

    /**
     * Returns CallType's Description.
     *
     * @method getDescription
     * @return {any} The callType's Description.
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns CallTypeDescription's callIds.
     *
     * @method getCallIds
     * @return {any} The CallTypeDescription's callIds.
     */
    getCallIds() {
        return this._callIds;
    }

    /**
     * Set the CallType's description.
     *
     * @method setDescription
     * @param {JSON Object} description - The CallType's description from Backend.
     */
    setDescription(description : any) {
        this._description = description;
    }

    /**
     * Add a callId to CallType Description.
     *
     * @method addCallId
     * @param {number} callId - The Call'sId to add.
     */
    addCallId(callId : number) {
        if(this._callIds.indexOf(callId) == -1) {
            this._callIds.push(callId);
        }
    }
}