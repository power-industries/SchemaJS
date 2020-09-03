const Type = require('@power-industries/typejs');
const Rule = require('../Util/Rule');
const Any = require('./Any');

class StringValidator extends Any {
	constructor() {
		super();

		this._uppercase = new Rule();
		this._lowercase = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._contains = new Rule();
		this._matches = new Rule();
		this._equals = new Rule();
	}

	default(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		return super.default(value);
	}
	uppercase() {
		this._uppercase.flag = true;

		return this;
	}
	lowercase() {
		this._lowercase.flag = true;

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
	contains(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this._contains.value = value;
		this._contains.flag = true;

		return this;
	}
	matches(value) {
		if(!(value instanceof RegExp))
			throw new TypeError('Expected value to be a RegExp');

		this._matches.value = value;
		this._matches.flag = true;

		return this;
	}
	equals(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this._equals.value = value;
		this._equals.flag = true;

		return this;
	}

	parseSync(data) {
		if(data instanceof Type.String) {
			if(this._uppercase.flag && data.toUpperCase() !== data)
				throw new Error('Expected data to be an Uppercase String');

			if(this._lowercase.flag && data.toLowerCase() !== data)
				throw new Error('Expected data to be an Lowercase String');

			if(this._min.flag && data.length < this._min.value)
				throw new Error('Expected data.length to be at least ' + this._min.value);

			if(this._max.flag && data.length > this._max.value)
				throw new Error('Expected data.length to be at most ' + this._max.value);

			if(this._contains.flag && !data.includes(this._contains.value))
				throw new Error('Expected data to contain ' + this._contains.value);

			if(this._matches.flag && !this._matches.value.test(data))
				throw new Error('Expected data to match the regex ' + this._matches.value.toString());

			if(this._equals.flag && data !== this._equals.value)
				throw new Error('Expected data to equal ' + this._equals.value);

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
				else
					throw new Error('Expected data to be a String');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = StringValidator;