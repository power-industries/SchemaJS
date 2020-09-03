const Type = require('@power-industries/typejs');
const Rule = require('../Util/Rule');
const Any = require('./Any');

class ArrayValidator extends Any {
	constructor() {
		super();

		this._min = new Rule();
		this._max = new Rule();
		this._item = new Rule();
	}

	default(value) {
		if (!(value instanceof Type.Array))
			throw new TypeError('Expected value to be an Array');

		return super.default(value);
	}
	min(value) {
		if (!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this._min.value = value;
		this._min.flag = true;

		return this;
	}
	max(value) {
		if (!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this._max.value = value;
		this._max.flag = true;

		return this;
	}
	item(value) {
		if(!(value instanceof Any))
			throw new TypeError('Expected value to be a Validator');

		this._item.value = value;
		this._item.flag = true;

		return this;
	}

	parseSync(data) {
		if(data instanceof Type.Array) {
			if(this._min.flag && data.length < this._min.value)
				throw new Error('Expected data.length to be at least ' + this._min.value);

			if(this._max.flag && data.length > this._max.value)
				throw new Error('Expected data.length to be at most ' + this._max.value);

			if(this._item.flag) {
				let result = [];

				data.forEach(element => {
					result.push(this._item.value.parseSync(element));
				});

				data = result;
			}

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw new Error('Expected data to be an Array');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = ArrayValidator;