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
	 * RendererTheme attached to CallType.
	 *
	 * @property _rendererTheme
	 * @type RendererTheme
	 */
	private _rendererTheme : string;

	/**
	 * Policy attached to CallType.
	 *
	 * @property _policy
	 * @type Policy
	 */
	private _policy : Policy;

	/**
	 * RefreshTime if is linked to a StaticSource, else null.
	 *
	 * @property _staticRefreshTime
	 * @type number
	 */
	private _staticRefreshTime : number;

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
		this._staticRefreshTime = null;
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
	 * Set the CallType's default rendererTheme.
	 *
	 * @method setRendererTheme
	 * @param {string} rendererTheme - The RendererTheme to set.
	 */
	setRendererTheme(rendererTheme : string) {
		this._rendererTheme = rendererTheme;
	}

	/**
	 * Get the CallType's default rendererTheme.
	 *
	 * @method getRendererTheme
	 * @return {string} rendererTheme - The CallType's RendererTheme.
	 */
	getRendererTheme() : string {
		return this._rendererTheme;
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

	/**
	 * Set the CallType's static refreshTime
	 *
	 * @method setStaticRefreshTime
	 * @param {number} staticRefreshTime - The static refreshTime
	 */
	setStaticRefreshTime(staticRefreshTime : number) {
		this._staticRefreshTime = staticRefreshTime;
	}

	/**
	 * Get the CallType's static refreshTime
	 *
	 * @method  getStaticRefreshTime
	 * @returns {number} the static refreshTime
	 */
	getStaticRefreshTime() : number {
		return this._staticRefreshTime;
	}
}