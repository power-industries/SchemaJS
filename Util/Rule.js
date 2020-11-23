const Type = require('@power-industries/typejs');

/**
 * Rule Class - used for setting up Boolean Rules with an optional Value
 */
class Rule {
	/**
	 * Creates a new Rule instance
	 * @constructor
	 * @param [flag] {Boolean} - If the Rule is active or not (optional)
	 * @param [value] {*} - An Optional value for the Rule (optional)
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
	 * @param value {Boolean} - The flag indicating if the Rule is active or not
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
	 * @returns {Boolean} - Indicates if the Rule is active or not
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