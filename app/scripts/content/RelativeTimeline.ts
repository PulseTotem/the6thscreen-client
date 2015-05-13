/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/core/InfoRenderer.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/timeline/RelativeTimelineItf.ts" />
/// <reference path="./RelativeEvent.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/behaviour/Behaviour.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/timelineRunner/TimelineRunner.ts" />

/**
 * Represents a RelativeTimeline of The6thScreen Client.
 *
 * @class RelativeTimeline
 * @implements RelativeTimelineItf
 */
class RelativeTimeline implements RelativeTimelineItf {

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
	 * TimelineRunner attached to RelativeTimeline.
	 *
	 * @property _timelineRunner
	 * @type TimelineRunner
	 */
	private _timelineRunner : TimelineRunner;

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
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The RelativeTimeline's id.
	 */
	constructor(id: number) {
		this._id = id;
		this._behaviour = null;
		this._timelineRunner = null;
		this._relativeEventsSorted = false;
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
	 * Set the RelativeTimeline's TimelineRunner.
	 *
	 * @method setTimelineRunner
	 * @param {TimelineRunner} behaviour - The TimelineRunner to set.
	 */
	setTimelineRunner(timelineRunner : TimelineRunner) {
		this._timelineRunner = timelineRunner;
		this._timelineRunner.setRelativeTimeline(this);
	}

	/**
	 * Return RelativeTimeline's relativeEvents.
	 *
	 * @method getRelativeEvents
	 * @return {Array<RelativeEvent>} relativeEvents - The RelativeTimeline's relativeEvents.
	 */
	getRelativeEvents() : Array<RelativeEvent> {
		return this._relativeEvents;
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

		this._timelineRunner.start();
	}

	/**
	 * Display given InfoRenderer list.
	 *
	 * @method display
	 * @param {Array<InfoRenderer<any>>>} listInfoRenderers - InfoRenderer list to display.
	 */
	display(listInfoRenderers : Array<InfoRenderer<any>>) {
//		Logger.debug("RelativeTimeline: '" + this.getId() + "' - display");

		this._behaviour.stop();
		this._behaviour.setListInfoRenderers(listInfoRenderers);
		this._behaviour.start();
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