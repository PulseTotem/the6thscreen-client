/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="./Call.ts" />

/**
 * Represents a RelativeEvent of The6thScreen Client.
 *
 * @class RelativeEvent
 */
class RelativeEvent {

	/**
	 * RelativeEvent's id.
	 *
	 * @property _id
	 * @type number
	 */
	private _id : number;

	/**
	 * RelativeEvent's position.
	 *
	 * @property _position
	 * @type number
	 */
	private _position : number;

	/**
	 * RelativeEvent's duration.
	 *
	 * @property _duration
	 * @type number
	 */
	private _duration : number;

	/**
	 * Call attached to RelativeEvent.
	 *
	 * @property _call
	 * @type Call
	 */
	private _call : Call;


	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The RelativeEvent's id.
	 * @param {number} position - The RelativeEvent's position.
	 * @param {number} duration - The RelativeEvent's duration.
	 */
	constructor(id: number, position : number, duration: number) {
		this._id = id;
		this._position = position;
		this._duration = duration;
		this._call = null;
	}

	/**
	 * Returns RelativeEvent's Id.
	 *
	 * @method getId
	 * @return {number} The RelativeEvent's Id.
	 */
	getId() : number {
		return this._id;
	}

	/**
	 * Get the RelativeEvent's Call.
	 *
	 * @method getCall
	 * @return {Call} The Call linked to RelativeEvent.
	 */
	getCall() : Call {
		return this._call;
	}

	/**
	 * Set the RelativeEvent's Call.
	 *
	 * @method setCall
	 * @param {Call} call - The Call to set.
	 */
	setCall(call : Call) {
		this._call = call;
	}
}