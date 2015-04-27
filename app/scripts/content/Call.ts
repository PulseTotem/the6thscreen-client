/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../structure/CallType.ts" />

/**
 * Represents a Call of The6thScreen Client.
 *
 * @class Call
 */
class Call {

	/**
	 * Call's id.
	 *
	 * @property _id
	 * @type number
	 */
	private _id : number;

	/**
	 * CallType attached to Call.
	 *
	 * @property _callType
	 * @type CallType
	 */
	private _callType : CallType;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The Call's id.
	 */
	constructor(id: number, name : string, description: string) {
		this._id = id;
		this._callType = null;
	}

	/**
	 * Returns Call's Id.
	 *
	 * @method getId
	 * @return {number} The Call's Id.
	 */
	getId() : number {
		return this._id;
	}

	/**
	 * Set the Call's callType.
	 *
	 * @method setCallType
	 * @param {CallType} callType - The CallType to set.
	 */
	setCallType(callType : CallType) {
		this._callType = callType;
	}
}