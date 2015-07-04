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
/// <reference path="../../../t6s-core/core-client/scripts/systemTrigger/SystemTrigger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/userTrigger/UserTrigger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/userTrigger/UserTriggerState.ts" />

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
	 * SystemTrigger attached to RelativeTimeline.
	 *
	 * @property _systemTrigger
	 * @type SystemTrigger
	 */
	private _systemTrigger : SystemTrigger;

	/**
	 * UserTrigger attached to RelativeTimeline.
	 *
	 * @property _userTrigger
	 * @type UserTrigger
	 */
	private _userTrigger : UserTrigger;

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
		this._systemTrigger = null;
		this._userTrigger = null;
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
	 * Get the RelativeTimeline's behaviour.
	 *
	 * @method getBehaviour
	 * @return {Behaviour} behaviour - The RelativeTimeline's behaviour.
	 */
	getBehaviour() : Behaviour {
		return this._behaviour;
	}

	/**
	 * Set the RelativeTimeline's TimelineRunner.
	 *
	 * @method setTimelineRunner
	 * @param {TimelineRunner} timelineRunner - The TimelineRunner to set.
	 */
	setTimelineRunner(timelineRunner : TimelineRunner) {
		this._timelineRunner = timelineRunner;
		this._timelineRunner.setRelativeTimeline(this);
	}

	/**
	 * Set the RelativeTimeline's SystemTrigger.
	 *
	 * @method setSystemTrigger
	 * @param {SystemTrigger} systemTrigger - The SystemTrigger to set.
	 */
	setSystemTrigger(systemTrigger : SystemTrigger) {
		this._systemTrigger = systemTrigger;
		this._systemTrigger.setRelativeTimeline(this);
	}

	/**
	 * Set the RelativeTimeline's UserTrigger.
	 *
	 * @method setUserTrigger
	 * @param {UserTrigger} userTrigger - The UserTrigger to set.
	 */
	setUserTrigger(userTrigger : UserTrigger) {
		this._userTrigger = userTrigger;
		this._userTrigger.setRelativeTimeline(this);
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
	 * Pause timeline.
	 *
	 * @method pause
	 */
	pause() {
//		Logger.debug("RelativeTimeline: '" + this.getId() + "' - pause");

		this._timelineRunner.pause();
		this._behaviour.pause();
	}

	/**
	 * Resume.
	 *
	 * @method resume
	 */
	resume() {
		this._behaviour.resume();
		this._timelineRunner.resume();
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
	 * Pause timeline and display InfoRenderer list in priority.
	 *
	 * @method pauseAndDisplay
	 * @param {Array<InfoRenderer<any>>>} listInfoRenderers - InfoRenderer list to display.
	 */
	pauseAndDisplay(listInfoRenderers : Array<InfoRenderer<any>>) {
//		Logger.debug("RelativeTimeline: '" + this.getId() + "' - pauseAndDisplay");

		if(this._userTrigger.getState() == UserTriggerState.WAITING) {
			this._timelineRunner.pause();
			this._behaviour.pause();
			this._behaviour.save();
			this._behaviour.setListInfoRenderers(listInfoRenderers);
			this._behaviour.start();
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Restore and Resume.
	 *
	 * @method restoreAndResume
	 */
	restoreAndResume() {
		this._behaviour.stop();
		this._behaviour.restore();
		this._behaviour.resume();
		this._timelineRunner.resume();
	}

	/**
	 * Add some InfoRenderer to current InfoRenderer list.
	 *
	 * @method addToCurrentDisplay
	 * @param {Array<InfoRenderer<any>>>} listInfoRenderers - InfoRenderer list to add.
	 */
	addToCurrentDisplay(listInfoRenderers : Array<InfoRenderer<any>>) {
		this._behaviour.addToCurrentListInfoRenderers(listInfoRenderers);
	}

	/**
	 * Display previous Info.
	 *
	 * @method displayPreviousInfo
	 */
	displayPreviousInfo() {
		if(! this._behaviour.displayPreviousInfo()) {
			this._timelineRunner.displayLastInfoOfPreviousEvent();
		}
	}

	/**
	 * Display next Info.
	 *
	 * @method displayNextInfo
	 */
	displayNextInfo() {
		if(! this._behaviour.displayNextInfo()) {
			this._timelineRunner.displayFirstInfoOfNextEvent();
		}
	}

	/**
	 * Display last Info.
	 *
	 * @method displayLastInfo
	 */
	displayLastInfo() {
		this._behaviour.displayLastInfo();
	}

	/**
	 * Display first Info.
	 *
	 * @method displayFirstInfo
	 */
	displayFirstInfo() {
		this._behaviour.displayFirstInfo();
	}

	/**
	 * Update Info if it's currently display
	 *
	 * @method updateInfoIfCurrentlyDisplay
	 * @param {Info} info - Info to update.
	 */
	updateInfoIfCurrentlyDisplay(info : Info) {
		this._behaviour.updateInfoIfCurrentlyDisplay(info);
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