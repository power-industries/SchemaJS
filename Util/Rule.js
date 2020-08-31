const Type = require('@power-industries/typejs');

class Rule {
	constructor(flag = false, value = null) {
		if(!(flag instanceof Type.Boolean))
			throw new TypeError('Expected flag to be a Boolean');

		this._flag = flag;
		this._value = value;
	}

	set flag(value) {
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

		this._flag = value;
	}
	set value(value) {
		this._value = value;
	}

	get flag() {
		return this._flag;
	}
	get value() {
		return this._value;
	}
}

module.exports = Rule;