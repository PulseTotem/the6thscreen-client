/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../core/MapInfoRenderer.ts" />

class Behaviour {
	private _listMapInfoRenderer : Array<MapInfoRenderer<any>>;
	private _isRunning : boolean;
	private _currentDisplayedInformationIndex : number;
	private _domElement : any;
	private _tick : number;

	constructor() {
		this._listMapInfoRenderer = new Array<MapInfoRenderer<any>>();
		this._tick = 5000;
	}

	buildListMapInfoRenderer(calls : Array<Call>) {
		var self = this;

		calls.forEach(function(call) {
			var listInfos = call.getListInfos();
			var renderer = call.getRenderer();
			var renderPolicy = call.getRenderPolicy();

			var processedList = renderer.transformForBehaviour(listInfos, renderPolicy);

			processedList.forEach(function(info) {
				self._listMapInfoRenderer.push(new MapInfoRenderer(info, renderer));
			});
		});
	}

	displayInfo() {
		var self = this;

		if (!this._isRunning) {
			this._currentDisplayedInformationIndex = 0;
			this._isRunning = true;
		}

		var now = new Date();
		var mapToDispay : MapInfoRenderer<any> = this._listMapInfoRenderer[this._currentDisplayedInformationIndex];

		var info = mapToDispay.info;
		var renderer = mapToDispay.renderer;

		this._currentDisplayedInformationIndex = (this._currentDisplayedInformationIndex + 1) % (this._listMapInfoRenderer.length);

		if (now < info.getObsoleteDate()) {
			renderer.render(info, this._domElement);
			setTimeout(function() {
				self.displayInfo();
			}, info.getDurationToDisplay());
		} else {
			this.displayInfo();
		}
	}
}