/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
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
	 * ZoneContent Div. (div representing the zone)
	 *
	 * @property _zoneContentDiv
	 * @type DOM Element
	 */
	private _zoneContentDiv : any;

	/**
	 * Zone Div.
	 *
	 * @property _zoneDiv
	 * @type DOM Element
	 */
	private _zoneDiv : any;

	/**
	 * Zone Background Div.
	 *
	 * @property _zoneBackgroundDiv
	 * @type DOM Element
	 */
	private _zoneBackgroundDiv : any;

	/**
	 * Zone's z-index backup.
	 *
	 * @property _zIndexBackup
	 * @type number
	 */
	private _zIndexBackup : number;

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
		this._zIndexBackup = null;
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
	 * Returns Zone's positionFromTop.
	 *
	 * @method getPositionFromTop
	 * @return {number} The zone's positionFromTop.
	 */
	getPositionFromTop() : number {
		return this._positionFromTop;
	}

	/**
	 * Returns Zone's positionFromLeft.
	 *
	 * @method getPositionFromLeft
	 * @return {number} The zone's positionFromLeft.
	 */
	getPositionFromLeft() : number {
		return this._positionFromLeft;
	}

	/**
	 * Returns Zone's width.
	 *
	 * @method getWidth
	 * @return {number} The zone's width.
	 */
	getWidth() : number {
		return this._width;
	}

	/**
	 * Returns Zone's height.
	 *
	 * @method getHeight
	 * @return {number} The zone's height.
	 */
	getHeight() : number {
		return this._height;
	}

	/**
	 * Get the Zone's behaviour.
	 *
	 * @method getBehaviour
	 * @return {Behaviour} behaviour - The Zone's Behaviour.
	 */
	getBehaviour() : Behaviour {
		return this._behaviour;
	}

	/**
	 * Set the Zone's behaviour.
	 *
	 * @method setBehaviour
	 * @param {Behaviour} behaviour - The Behaviour to set.
	 */
	setBehaviour(behaviour : Behaviour) {
		this._behaviour = behaviour;
		this._behaviour.setZone(this);
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
	 * Get the ZoneContent's div.
	 *
	 * @method getZoneContentDiv
	 */
	getZoneContentDiv() {
		return this._zoneContentDiv;
	}

	/**
	 * Get the Zone's div.
	 *
	 * @method getZoneDiv
	 */
	getZoneDiv() {
		return this._zoneDiv;
	}

	/**
	 * Get the Zone Background's div.
	 *
	 * @method getZoneBackgroundDiv
	 */
	getZoneBackgroundDiv() {
		return this._zoneBackgroundDiv;
	}

	/**
	 * Attach Zone to Client's DOM.
	 *
	 * @method attachToDom
	 * @param {string} clientDomId - DOM Id where append ZoneDiv.
	 */
	attachToDom(clientDomId : string) {
		var self = this;

		this._zoneContentDiv = $("<div>");
		this._zoneContentDiv.addClass("zone");
		this._zoneContentDiv.css("top", this._positionFromTop + "%");
		this._zoneContentDiv.css("left", this._positionFromLeft + "%");
		this._zoneContentDiv.css("width", this._width + "%");
		this._zoneContentDiv.css("height", this._height + "%");

		this._zoneBackgroundDiv = $("<div>");
		this._zoneBackgroundDiv.addClass("zone_background");

		this._zoneDiv = $("<div>");
		this._zoneDiv.addClass("zone_content");

		this._zoneContentDiv.append(this._zoneBackgroundDiv);
		this._zoneContentDiv.append(this._zoneDiv);

		$(clientDomId).append(this._zoneContentDiv);

		this.setOrientation();

		if(this._width >= 75) {
			this._zoneDiv.addClass("width_lg");
		} else if(this._width >= 50) {
			this._zoneDiv.addClass("width_md");
		} else if(this._width >= 25) {
			this._zoneDiv.addClass("width_sm");
		} else {
			this._zoneDiv.addClass("width_xs");
		}

		if(this._height >= 75) {
			this._zoneDiv.addClass("height_lg");
		} else if(this._height >= 50) {
			this._zoneDiv.addClass("height_md");
		} else if(this._height >= 25) {
			this._zoneDiv.addClass("height_sm");
		} else {
			this._zoneDiv.addClass("height_xs");
		}
	}

	/**
	 * Set the zone's orientation dealing with zone width and height in pixels.
	 *
	 * @method setOrientation
	 */
	setOrientation() {
		this._zoneContentDiv.removeClass("landscape");
		this._zoneContentDiv.removeClass("portrait");

		var zoneWidth = this._zoneContentDiv.width();
		var zoneHeight = this._zoneContentDiv.height();

		if(zoneWidth >= zoneHeight) {
			this._zoneContentDiv.addClass("landscape");
		} else {
			this._zoneContentDiv.addClass("portrait");
		}
	}

	/**
	 * Enable zone in fullscreen.
	 *
	 * @method enableFullscreen
	 */
	enableFullscreen() {
		this._zIndexBackup = this._zoneContentDiv.css("z-index");
		this._zoneContentDiv.css("z-index", 10000);

		this._zoneContentDiv.css("top", "0%");
		this._zoneContentDiv.css("left", "0%");
		this._zoneContentDiv.css("width", "100%");
		this._zoneContentDiv.css("height", "100%");

		this.setOrientation();

		this._zoneDiv.removeClass("width_lg");
		this._zoneDiv.removeClass("width_md");
		this._zoneDiv.removeClass("width_sm");
		this._zoneDiv.removeClass("width_xs");
		this._zoneDiv.removeClass("height_lg");
		this._zoneDiv.removeClass("height_md");
		this._zoneDiv.removeClass("height_sm");
		this._zoneDiv.removeClass("height_xs");

		this._zoneDiv.addClass("width_lg");
		this._zoneDiv.addClass("height_lg");
	}

	/**
	 * Disable zone in fullscreen.
	 *
	 * @method disableFullscreen
	 */
	disableFullscreen() {
		this._zoneContentDiv.css("z-index", this._zIndexBackup);

		this._zoneContentDiv.css("top", this._positionFromTop + "%");
		this._zoneContentDiv.css("left", this._positionFromLeft + "%");
		this._zoneContentDiv.css("width", this._width + "%");
		this._zoneContentDiv.css("height", this._height + "%");

		this.setOrientation();

		if(this._width >= 75) {
			this._zoneDiv.addClass("width_lg");
		} else if(this._width >= 50) {
			this._zoneDiv.addClass("width_md");
		} else if(this._width >= 25) {
			this._zoneDiv.addClass("width_sm");
		} else {
			this._zoneDiv.addClass("width_xs");
		}

		if(this._height >= 75) {
			this._zoneDiv.addClass("height_lg");
		} else if(this._height >= 50) {
			this._zoneDiv.addClass("height_md");
		} else if(this._height >= 25) {
			this._zoneDiv.addClass("height_sm");
		} else {
			this._zoneDiv.addClass("height_xs");
		}
	}

	/**
	 * Start Zone activity.
	 *
	 * @method start
	 */
	start() {
//		Logger.debug("Zone: '" + this.getId() + "' - start");
		/*if(this._widget != null) {

		} else */

		if(this._relativeTimeline != null) {
			this._relativeTimeline.start();
		}

		/* else if(this._absoluteTimeline != null) {

		} else {
			// ERROR !?
		}*/
	}
}