/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/behaviour/Behaviour.ts" />

/// <reference path="../content/RelativeTimeline.ts" />

declare var $: any; // Use of JQuery

/**
 * Represents a Zone of The6thScreen Client.
 *
 * @class Zone
 */
class Zone {

	/**
	 * Zone's id.
	 *
	 * @property _id
	 * @type number
	 */
	private _id : number;

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
	 * Behaviour attached to Zone.
	 *
	 * @property _behaviour
	 * @type Behaviour
	 */
	private _behaviour : Behaviour;

	/**
	 * RelativeTimeline attached to Zone.
	 *
	 * @property _relativeTimeline
	 * @type RelativeTimeline
	 */
	private _relativeTimeline : RelativeTimeline;

	/**
	 * Zone Div.
	 *
	 * @property _zoneDiv
	 * @type DOM Element
	 */
	private _zoneDiv : any;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The Zone's id.
	 * @param {string} name - The Zone's name.
	 * @param {string} description - The Zone's description.
	 * @param {number} width - The Zone's width.
	 * @param {number} height - The Zone's height.
	 * @param {number} positionFromTop - The Zone's positionFromTop.
	 * @param {number} positionFromLeft - The Zone's positionFromLeft.
	 */
	constructor(id: number, name : string, description: string, width: number, height: number, positionFromTop: number, positionFromLeft: number) {
		this._id = id;
		this._name = name;
		this._description = description;
		this._width = width;
		this._height = height;
		this._positionFromTop = positionFromTop;
		this._positionFromLeft = positionFromLeft;
		this._behaviour = null;
		this._relativeTimeline = null;
	}

	/**
	 * Returns Zone's Id.
	 *
	 * @method getId
	 * @return {number} The zone's Id.
	 */
	getId() : number {
		return this._id;
	}

	/**
	 * Set the Zone's behaviour.
	 *
	 * @method setBehaviour
	 * @param {Behaviour} behaviour - The Behaviour to set.
	 */
	setBehaviour(behaviour : Behaviour) {
		this._behaviour = behaviour;
	}

	/**
	 * Set the Zone's RelativeTimeline.
	 *
	 * @method setRelativeTimeline
	 * @param {RelativeTimeline} relTimeline - The RelativeTimeline to set.
	 */
	setRelativeTimeline(relTimeline : RelativeTimeline) {
		this._relativeTimeline = relTimeline;
	}

	/**
	 * Attach Zone to Client's DOM.
	 *
	 * @method attachToDom
	 * @param {string} clientDomId - DOM Id where append ZoneDiv.
	 */
	attachToDom(clientDomId : string) {
		this._zoneDiv = $("<div>");
		this._zoneDiv.addClass("zone");
		this._zoneDiv.css("top", this._positionFromTop + "%");
		this._zoneDiv.css("left", this._positionFromLeft + "%");
		this._zoneDiv.css("width", this._width + "%");
		this._zoneDiv.css("height", this._height + "%");


		$(clientDomId).append(this._zoneDiv);
	}
}