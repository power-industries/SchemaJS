const Validator = require('./Validator.base');
const Type = require('@power-industries/typejs');

class StringValidator extends Validator {
	constructor() {
		super();

		this._rule = {
			required: {
				flag: false
			},
			min: {
				flag: false,
				value: null
			},
			max: {
				flag: false,
				value: null
			},
			uppercase: {
				flag: false
			},
			lowercase: {
				flag: false
			},
			contains: {
				flag: false,
				value: null
			},
			equals: {
				flag: false,
				value: null
			},
			matches: {
				flag: false,
				value: null
			},
			default: {
				flag: false,
				value: null
			}
		}
	}

	required() {
		this._rule.required.flag = true;

		return this;
	}
	min(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this._rule.min.value = value;
		this._rule.min.flag = true;

		return this;
	}
	max(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this._rule.max.value = value;
		this._rule.max.flag = true;

		return this;
	}
	uppercase() {
		this._rule.uppercase.flag = true;

		return this;
	}
	lowercase() {
		this._rule.lowercase.flag = true;

		return this;
	}
	contains(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this._rule.contains.value = value;
		this._rule.contains.flag = true;

		return this;
	}
	matches(value) {
		if(!(value instanceof RegExp))
			throw new TypeError('Expected value to be a RegExp');

		this._rule.matches.value = value;
		this._rule.matches.flag = true;

		return this;
	}
	equals(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this._rule.equals.value = value;
		this._rule.equals.flag = true;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this._rule.default.value = value;
		this._rule.default.flag = true;

		return this;
	}

	validate(data) {
		return new Promise((resolve, reject) => {
			if(data instanceof Type.String) {
				if(this._rule.min.flag && data.length < this._rule.min.value)
					return reject();

				if(this._rule.max.flag && data.length > this._rule.max.value)
					return reject();

				if(this._rule.uppercase.flag && data.toUpperCase() !== data)
					return reject();

				if(this._rule.lowercase.flag && data.toLowerCase() !== data)
					return reject();

				if(this._rule.contains.flag && !data.includes(this._rule.contains.value))
					return reject();

				if(this._rule.matches.flag && !this._rule.matches.value.test(data))
					return reject();

				if(this._rule.equals.flag && data !== this._rule.equals.value)
					return reject();

				return resolve();
			}
			else {
				if(this._rule.required.flag) {
					if(this._rule.default.flag)
						return resolve();
					else
						return reject();
				}
				else {
					return resolve();
				}
			}
		});
	}
	validateSync(data) {
		if(data instanceof Type.String) {
			if(this._rule.min.flag && data.length < this._rule.min.value)
				return false;

			if(this._rule.max.flag && data.length > this._rule.max.value)
				return false;

			if(this._rule.uppercase.flag && data.toUpperCase() !== data)
				return false;

			if(this._rule.lowercase.flag && data.toLowerCase() !== data)
				return false;

			if(this._rule.contains.flag && !data.includes(this._rule.contains.value))
				return false;

			if(this._rule.matches.flag && !this._rule.matches.value.test(data))
				return false;

			return !(this._rule.equals.flag && data !== this._rule.equals.value);
		}
		else {
			if(this._rule.required.flag) {
				return this._rule.default.flag;
			}
			else {
				return true;
			}
		}
	}

	parse(data) {
		return new Promise((resolve, reject) => {
			if(data instanceof Type.String) {
				if(this._rule.min.flag && data.length < this._rule.min.value)
					return reject(new Error('Expected data to be larger than or equal to ' + this._rule.min.value));

				if(this._rule.max.flag && data.length > this._rule.max.value)
					return reject(new Error('Expected data to be smaller than or equal to ' + this._rule.max.value));

				if(this._rule.uppercase.flag && data.toUpperCase() !== data)
					return reject(new Error('Expected data to be an Uppercase String'));

				if(this._rule.lowercase.flag && data.toLowerCase() !== data)
					return reject(new Error('Expected data to be an Lowercase String'));

				if(this._rule.contains.flag && !data.includes(this._rule.contains.value))
					return reject(new Error('Expected data to contain ' + this._rule.contains.value));

				if(this._rule.matches.flag && !this._rule.matches.value.test(data))
					return reject(new Error('Expected data to match the regex ' + this._rule.matches.value.toString()));

				if(this._rule.equals.flag && data !== this._rule.equals.value)
					return reject(new Error('Expected data to equal ' + this._rule.equals.value));

				return resolve(data);
			}
			else {
				if(this._rule.required.flag) {
					if(this._rule.default.flag)
						return resolve(this._rule.default.value);
					else
						return reject(new Error('Expected data to be a String'));
				}
				else {
					return resolve(null);
				}
			}
		});
	}
	parseSync(data) {
		if(data instanceof Type.String) {
			if(this._rule.min.flag && data.length < this._rule.min.value)
				throw new Error('Expected data to be larger than or equal to ' + this._rule.min.value);

			if(this._rule.max.flag && data.length > this._rule.max.value)
				throw new Error('Expected data to be smaller than or equal to ' + this._rule.max.value);

			if(this._rule.uppercase.flag && data.toUpperCase() !== data)
				throw new Error('Expected data to be an Uppercase String');

			if(this._rule.lowercase.flag && data.toLowerCase() !== data)
				throw new Error('Expected data to be an Lowercase String');

			if(this._rule.contains.flag && !data.includes(this._rule.contains.value))
				throw new Error('Expected data to contain ' + this._rule.contains.value);

			if(this._rule.matches.flag && !this._rule.matches.value.test(data))
				throw new Error('Expected data to match the regex ' + this._rule.matches.value.toString());

			if(this._rule.equals.flag && data !== this._rule.equals.value)
				throw new Error('Expected data to equal ' + this._rule.equals.value);

			return data;
		}
		else {
			if(this._rule.required.flag) {
				if(this._rule.default.flag)
					return this._rule.default.value;
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