/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../../t6s-core/core-client/scripts/core/Logger.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/renderer/Renderer.ts" />
/// <reference path="../../../t6s-core/core-client/scripts/policy/Policy.ts" />

/**
 * Represents a CallType of The6thScreen Client.
 *
 * @class CallType
 */
class CallType {

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
	private _renderer : Renderer;

	/**
	 * Policy attached to CallType.
	 *
	 * @property _policy
	 * @type Policy
	 */
	private _policy : Policy;


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
	setRenderer(renderer : Renderer) {
		this._renderer = renderer;
	}

	/**
	 * Get the CallType's renderer.
	 *
	 * @method getRenderer
	 * @return {Renderer} renderer - The CallType's Renderer.
	 */
	getRenderer() : Renderer {
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
}