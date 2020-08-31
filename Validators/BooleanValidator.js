const Type = require('@power-industries/typejs');
const Rule = require('../Util/Rule');
const Any = require('./Any');

class BooleanValidator extends Any {
	constructor() {
		super();
		this._equals = new Rule();
	}

	default(value) {
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

		return super.default(value);
	}
	equals(value) {
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

	parseSync(data) {
		if(data instanceof Type.Boolean) {
			if(this._equals.flag && data !== this._equals.value)
				throw new Error('Expected data to equal ' + this._equals.value);

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw new Error('Expected data to be a Boolean');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = BooleanValidator;