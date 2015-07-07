/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr, simon.urli@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/timeline/CallTypeItf.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/renderer/Renderer.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/policy/Policy.ts" />

/**
 * Represents a CallType of The6thScreen Client.
 *
 * @class CallType
 * @implements CallTypeItf
 */
class CallType implements CallTypeItf{

	/**
	 * CallType's id.
	 *
	 * @property _id
	 * @type number
	 */
	private _id : number;

	/**
	 * CallType's name.
	 *
	 * @property _name
	 * @type string
	 */
	private _name : string;

	/**
	 * CallType's description.
	 *
	 * @property _description
	 * @type string
	 */
	private _description : string;

	/**
	 * Renderer attached to CallType.
	 *
	 * @property _renderer
	 * @type Renderer
	 */
	private _renderer : Renderer<any>;

	/**
	 * Policy attached to CallType.
	 *
	 * @property _policy
	 * @type Policy
	 */
	private _policy : Policy;


	/**
	 * StaticSource name if existing, else null.
	 *
	 * @property _staticSourceName
	 * @type string
	 */
	private _staticSourceName : string;


	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {number} id - The CallType's id.
	 * @param {string} name - The CallType's name.
	 * @param {string} description - The CallType's description.
	 */
	constructor(id: number, name : string, description: string) {
		this._id = id;
		this._name = name;
		this._description = description;
		this._renderer = null;
		this._policy = null;
		this._staticSourceName = null;
	}

	/**
	 * Returns CallType's Id.
	 *
	 * @method getId
	 * @return {number} The CallType's Id.
	 */
	getId() : number {
		return this._id;
	}

	/**
	 * Set the CallType's renderer.
	 *
	 * @method setRenderer
	 * @param {Renderer} renderer - The Renderer to set.
	 */
	setRenderer(renderer : Renderer<any>) {
		this._renderer = renderer;
	}

	/**
	 * Get the CallType's renderer.
	 *
	 * @method getRenderer
	 * @return {Renderer} renderer - The CallType's Renderer.
	 */
	getRenderer() : Renderer<any> {
		return this._renderer;
	}

	/**
	 * Set the CallType's policy.
	 *
	 * @method setPolicy
	 * @param {Policy} policy - The Policy to set.
	 */
	setPolicy(policy : Policy) {
		this._policy = policy;
	}

	/**
	 * Get the CallType's policy.
	 *
	 * @method getPolicy
	 * @return {Policy} policy - The CallType's Policy.
	 */
	getPolicy() : Policy {
		return this._policy;
	}

	/**
	 * Set the CallType's static source name
	 *
	 * @method setStaticSourceName
	 * @param staticSourceName - The static source name
	 */
	setStaticSourceName(staticSourceName : string) {
		this._staticSourceName = staticSourceName;
	}

	/**
	 * Get the CallType's static source name
	 *
	 * @method  getStaticSourceName
	 * @returns {string}
	 */
	getStaticSourceName() : string {
		return this._staticSourceName;
	}
}