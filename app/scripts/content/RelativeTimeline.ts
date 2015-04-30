/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="./RelativeEvent.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/behaviour/Behaviour.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/renderer/Renderer.ts" />
/// <reference path="../../../t6s-core/core-client/t6s-core/core/scripts/infotype/Info.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/core/InfoRenderer.ts" />

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
	 * Indicates if RelativeEvents array is sorted or not.
	 *
	 * @property _relativeEventsSorted
	 * @type boolean
	 */
	private _relativeEventsSorted : boolean;

	/**
	 * RelativeEvents attached to RelativeTimeline.
	 *
	 * @property _relativeEvents
	 * @type Array<RelativeEvent>
	 */
	private _relativeEvents : Array<RelativeEvent>;

	/**
	 * RelativeTimeline's current RelativeEvent id in _relativeEvents array.
	 *
	 * @property _currentEventId
	 * @type number
	 */
	private _currentEventId : number;

	/**
	 * RelativeTimeline's loop timeout.
	 *
	 * @property _loopTimeout
	 * @type number (id of timeout)
	 */
	private _loopTimeout : any;


	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The RelativeTimeline's id.
	 */
	constructor(id: number) {
		this._id = id;
		this._behaviour = null;
		this._relativeEventsSorted = false;
		this._relativeEvents = new Array<RelativeEvent>();
		this._currentEventId = null;
		this._loopTimeout = null;
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
//		Logger.debug("RelativeTimeline : '" + this.getId() + "' - addRelativeEvent : '" + relEvent.getId() + "'");
		this._relativeEvents.push(relEvent);
		this._relativeEventsSorted = false;
	}

	/**
	 * Start RelativeTimeline activity.
	 *
	 * @method start
	 */
	start() {
//		Logger.debug("RelativeTimeline: '" + this.getId() + "' - start");

		if(!this._relativeEventsSorted) {
			this._sortRelativeEvents();
		}

		this._relativeEvents.forEach(function(relEvent : RelativeEvent) {
			relEvent.getCall().start();
		});

		this._nextEvent();
	}

	/**
	 * Manage next event in Timeline.
	 *
	 * @method _nextEvent
	 * @private
	 */
	private _nextEvent() {
		var self = this;

		this._loopTimeout = null;

		if(this._currentEventId == null) {
			this._currentEventId = 0;
		} else {
			this._currentEventId = (this._currentEventId + 1) % (this._relativeEvents.length);
		}

		var currentEvent = this._relativeEvents[this._currentEventId];

		var renderer : Renderer<any> = currentEvent.getCall().getCallType().getRenderer();

		var listInfos : Array<Info> = currentEvent.getCall().getListInfos();

		if(listInfos.length > 0) {

			var listInfoRenderers:Array<InfoRenderer<any>> = listInfos.map(function (e, i) {
				return new InfoRenderer(e, renderer);
			});

			if (listInfoRenderers.length > 0) {
				this._behaviour.stop();
				this._behaviour.setListInfoRenderers(listInfoRenderers);
				this._behaviour.start();

				this._loopTimeout = setTimeout(function () {
					self._nextEvent();
				}, currentEvent.getDuration() * 1000);
			} else {
				setTimeout(function() {
					self._nextEvent();
				}, 1000);
			}

		} else {
			setTimeout(function() {
				self._nextEvent();
			}, 1000);
		}
	}

	/**
	 * Sort RelativeTimeline's events.
	 *
	 * @method _sortRelativeEvents
	 * @private
	 */
	private _sortRelativeEvents() {
		var self = this;

		var map = this._relativeEvents.map(function(e, i) {
			return { index: i, value: e.getPosition() };
		});

		map.sort(function(a, b) {
			return a.value - b.value;
		});

		var result = map.map(function(e){
			return self._relativeEvents[e.index];
		});

		this._relativeEvents = result;

		this._relativeEventsSorted = true;
	}
}