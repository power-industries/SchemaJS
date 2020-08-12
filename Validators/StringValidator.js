const Validator = require('./Validator');
const Type = require('@power-industries/typejs');

class StringValidator extends Validator {
	#rule = {
		required: {
			flag: false
		},
		default: {
			flag: false,
			value: null
		},
		uppercase: {
			flag: false
		},
		lowercase: {
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
		}
	}

	constructor() {
		super();
	}

	required() {
		this.#rule.required.flag = true;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this.#rule.default.value = value;
		this.#rule.default.flag = true;

		return this;
	}
	uppercase() {
		this.#rule.uppercase.flag = true;

		return this;
	}
	lowercase() {
		this.#rule.lowercase.flag = true;

		return this;
	}
	min(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this.#rule.min.value = value;
		this.#rule.min.flag = true;

		return this;
	}
	max(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this.#rule.max.value = value;
		this.#rule.max.flag = true;

		return this;
	}
	contains(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this.#rule.contains.value = value;
		this.#rule.contains.flag = true;

		return this;
	}
	matches(value) {
		if(!(value instanceof RegExp))
			throw new TypeError('Expected value to be a RegExp');

		this.#rule.matches.value = value;
		this.#rule.matches.flag = true;

		return this;
	}
	equals(value) {
		if(!(value instanceof Type.String))
			throw new TypeError('Expected value to be a String');

		this.#rule.equals.value = value;
		this.#rule.equals.flag = true;

		return this;
	}

	validate(data) {
		return new Promise((resolve, reject) => {
			if(this.validateSync(data))
				return resolve();
			else
				return reject();
		});
	}
	validateSync(data) {
		try {
			this.parseSync(data);
			return true;
		}
		catch (e) {
			return false;
		}
	}
	parse(data) {
		return new Promise((resolve, reject) => {
			try {
				return resolve(this.parseSync(data));
			}
			catch (e) {
				return reject(e);
			}
		});
	}
	parseSync(data) {
		if(data instanceof Type.String) {
			if(this.#rule.uppercase.flag && data.toUpperCase() !== data)
				throw new Error('Expected data to be an Uppercase String');

			if(this.#rule.lowercase.flag && data.toLowerCase() !== data)
				throw new Error('Expected data to be an Lowercase String');

			if(this.#rule.min.flag && data.length < this.#rule.min.value)
				throw new Error('Expected data.length to be at least ' + this.#rule.min.value);

			if(this.#rule.max.flag && data.length > this.#rule.max.value)
				throw new Error('Expected data.length to be at most ' + this.#rule.max.value);

			if(this.#rule.contains.flag && !data.includes(this.#rule.contains.value))
				throw new Error('Expected data to contain ' + this.#rule.contains.value);

			if(this.#rule.matches.flag && !this.#rule.matches.value.test(data))
				throw new Error('Expected data to match the regex ' + this.#rule.matches.value.toString());

			if(this.#rule.equals.flag && data !== this.#rule.equals.value)
				throw new Error('Expected data to equal ' + this.#rule.equals.value);

			return data;
		}
		else {
			if(this.#rule.required.flag) {
				if(this.#rule.default.flag)
					return this.#rule.default.value;
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