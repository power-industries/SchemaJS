const Type = require('@power-industries/typejs');

/**
 * Rule Classes are used to define a single Rule.
 * A single Rule can be enabled or disabled based on flag and can have an optional value.
 */
class Rule {
	/**
	 * Creates a new Rule
	 * @constructor
	 * @param [flag=false] {Boolean} - If the Rule is active or not (optional, defaults to false)
	 * @param [value=null] {*} - An Optional value for the Rule (optional, defaults to null)
	 * @throws {TypeError} - Throws a TypeError if flag is not a Boolean
	 */
	constructor(flag = false, value = null) {
		if(!(flag instanceof Type.Boolean))
			throw new TypeError('Expected flag to be a Boolean');

		this._flag = flag;
		this._value = value;
	}

	/**
	 * Setter for flag
	 * @param value {Boolean} - A Boolean enabling or disabling the Rule
	 * @throws {TypeError} - Throws a TypeError if flag is not a Boolean
	 */
	set flag(value) {
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

		this._flag = value;
	}

	/**
	 * Setter for value
	 * @param value {*} - An optional value for the Rule
	 */
	set value(value) {
		this._value = value;
	}

	/**
	 * Getter for flag
	 * @returns {Boolean} - Indicates if the Rule is enabled or disabled
	 */
	get flag() {
		return this._flag;
	}

	/**
	 * Getter for value
	 * @returns {*} - Returns the optional value for the Rule
	 */
	get value() {
		return this._value;
	}
}

module.exports = Rule;