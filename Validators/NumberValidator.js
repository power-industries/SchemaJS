const Type = require('@power-industries/typejs');
const Rule = require('../Util/Rule');
const Any = require('./Any');

class NumberValidator extends Any {
	constructor() {
		super();

		this._integer = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._equals = new Rule();
	}

	default(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		return super.default(value);
	}
	integer() {
		this._integer.flag = true;

		return this;
	}
	min(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this._min.value = value;
		this._min.flag = true;

		return this;
	}
	max(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}
	equals(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

	parseSync(data) {
		if(data instanceof Type.Number) {
			if(this._integer.flag && !Number.isSafeInteger(data))
				throw new Error('Expected data to be an Integer');

			if(this._min.flag && data < this._min.value)
				throw new Error('Expected data to be at least ' + this._min.value);

			if(this._max.flag && data > this._max.value)
				throw new Error('Expected data to be at most ' + this._max.value);

			if(this._equals.flag && data !== this._equals.value)
				throw new Error('Expected data to equal ' + this._equals.value);

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw new Error('Expected data to be a Number');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = NumberValidator;