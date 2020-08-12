const Validator = require('./Validator');
const Type = require('@power-industries/typejs');

class BooleanValidator extends Validator {
	#rule = {
		required: {
			flag: false
		},
		default: {
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
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

		this.#rule.default.value = value;
		this.#rule.default.flag = true;

		return this;
	}
	equals(value) {
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

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
		if(data instanceof Type.Boolean) {
			if(this.#rule.equals.flag && data !== this.#rule.equals.value)
				throw new Error('Expected data to equal ' + this.#rule.equals.value);

			return data;
		}
		else {
			if(this.#rule.required.flag) {
				if(this.#rule.default.flag)
					return this.#rule.default.value;
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