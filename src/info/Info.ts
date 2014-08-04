class Info {
	private _id : string;
	private _priority : number;
	private _creationDate : Date;
	private _castingDate : Date;
	private _obsoleteDate : Date;
	private _durationToDisplay : number;

	constructor() {
		this._id = "toto";

	}

	getDurationToDisplay() {
		return this._durationToDisplay;
	}

	getObsoleteDate() {
		return this._obsoleteDate;
	}
}