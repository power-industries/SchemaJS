const Validator = require('./Validator');
const Type = require('@power-industries/typejs');

class ArrayValidator extends Validator {
	#rule = {
		required: {
			flag: false
		},
		default: {
			flag: false,
			value: null
		},
		min: {
			flag: false,
			value: null
		},
		max: {
			flag: false,
			value: null
		},
		item: {
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
		if (!(value instanceof Type.Array))
			throw new TypeError('Expected value to be an Array');

		this.#rule.default.value = value;
		this.#rule.default.flag = true;

		return this;
	}
	min(value) {
		if (!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this.#rule.min.value = value;
		this.#rule.min.flag = true;

		return this;
	}
	max(value) {
		if (!(value instanceof Type.Number))
			throw new TypeError('Expected value to be a Number');

		this.#rule.max.value = value;
		this.#rule.max.flag = true;

		return this;
	}
	item(value) {
		if(!(value instanceof Validator))
			throw new TypeError('Expected value to be a Validator');

		this.#rule.item.value = value;
		this.#rule.item.flag = true;

		return this;
	}

	validate(data) {
		return new Promise((resolve, reject) => {
			if (this.validateSync(data))
				return resolve();
			else
				return reject();
		});
	}
	validateSync(data) {
		try {
			this.parseSync(data);
			return true;
		} catch (e) {
			return false;
		}
	}
	parse(data) {
		return new Promise((resolve, reject) => {
			try {
				return resolve(this.parseSync(data));
			} catch (e) {
				return reject(e);
			}
		});
	}
	parseSync(data) {
		if(data instanceof Type.Array) {
			if(this.#rule.min.flag && data.length < this.#rule.min.value)
				throw new Error('Expected data.length to be at least ' + this.#rule.min.value);

			if(this.#rule.max.flag && data.length > this.#rule.max.value)
				throw new Error('Expected data.length to be at most ' + this.#rule.max.value);

			if(this.#rule.item.flag) {
				let result = [];

				data.forEach(element => {
					result.push(this.#rule.item.value.parseSync(element));
				});

				data = result;
			}

			return data;
		}
		else {
			if(this.#rule.required.flag) {
				if(this.#rule.default.flag)
					return this.#rule.default.value;
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