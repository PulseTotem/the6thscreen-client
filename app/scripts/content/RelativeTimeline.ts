/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/behaviour/Behaviour.ts" />
/// <reference path="./RelativeEvent.ts" />

/**
 * Represents a RelativeTimeline of The6thScreen Client.
 *
 * @class RelativeTimeline
 */
class RelativeTimeline {

	/**
	 * RelativeTimeline's id.
	 *
	 * @property _id
	 * @type number
	 */
	private _id : number;

	/**
	 * Behaviour attached to RelativeTimeline.
	 *
	 * @property _behaviour
	 * @type Behaviour
	 */
	private _behaviour : Behaviour;

	/**
	 * RelativeEvents attached to RelativeTimeline.
	 *
	 * @property _relativeEvents
	 * @type Array<RelativeEvent>
	 */
	private _relativeEvents : Array<RelativeEvent>;


	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The RelativeTimeline's id.
	 */
	constructor(id: number) {
		this._id = id;
		this._behaviour = null;
		this._relativeEvents = new Array<RelativeEvent>();
	}

	/**
	 * Returns RelativeTimeline's Id.
	 *
	 * @method getId
	 * @return {number} The RelativeTimeline's Id.
	 */
	getId() : number {
		return this._id;
	}

	/**
	 * Set the RelativeTimeline's behaviour.
	 *
	 * @method setBehaviour
	 * @param {Behaviour} behaviour - The Behaviour to set.
	 */
	setBehaviour(behaviour : Behaviour) {
		this._behaviour = behaviour;
	}

	/**
	 * Add a RelativeEvent to RelativeTimeline.
	 *
	 * @method addRelativeEvent
	 * @param {RelativeEvent} relEvent - The RelativeEvent to add.
	 */
	addRelativeEvent(relEvent : RelativeEvent) {
		this._relativeEvents.push(relEvent);
	}
}