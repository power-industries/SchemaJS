const Validator = require('./Validator');
const Type = require('@power-industries/typejs');

class NumberValidator extends Validator {
	#rule = {
		required: {
			flag: false
		},
		default: {
			flag: false,
			value: null
		},
		integer: {
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
		equals: {
			flag: false,
			value: null
		}
	};

	constructor() {
		super();
	}

	required() {
		this.#rule.required.flag = true;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this.#rule.default.value = value;
		this.#rule.default.flag = true;

		return this;
	}
	integer() {
		this.#rule.integer.flag = true;

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
	equals(value) {
		if(!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

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
		if(data instanceof Type.Number) {
			if(this.#rule.integer.flag && !Number.isSafeInteger(data))
				throw new Error('Expected data to be an Integer');

			if(this.#rule.min.flag && data < this.#rule.min.value)
				throw new Error('Expected data to be at least ' + this.#rule.min.value);

			if(this.#rule.max.flag && data > this.#rule.max.value)
				throw new Error('Expected data to be at most ' + this.#rule.max.value);

			if(this.#rule.equals.flag && data !== this.#rule.equals.value)
				throw new Error('Expected data to equal ' + this.#rule.equals.value);

			return data;
		}
		else {
			if(this.#rule.required.flag) {
				if(this.#rule.default.flag)
					return this.#rule.default.value;
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