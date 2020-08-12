const Validator = require('./Validator');
const Type = require('@power-industries/typejs');

class ObjectValidator extends Validator {
	#rule = {
		required: {
			flag: false
		},
		default: {
			flag: false,
			value: null
		},
		preserve: {
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
		schema: {
			flag: false,
			value: null
		},
		instanceof: {
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
		if(!(value instanceof Type.Object))
			throw new TypeError('Expected value to be an Object');

		this.#rule.default.value = value;
		this.#rule.default.flag = true;

		return this;
	}
	preserve() {
		this.#rule.preserve.flag = true;

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
	schema(value) {
		if(!(value instanceof Type.Object))
			throw new TypeError('Expected value to be an Object of Validators');

		Object.keys(value).forEach(key => {
			if(!(value[key] instanceof Validator))
				throw new TypeError('Expected value to be an Object of Validator');
		});

		this.#rule.schema.value = value;
		this.#rule.schema.flag = true;

		return this;
	}
	instanceof(value) {
		if(!(value instanceof Type.Function))
			throw new TypeError('Expected value to be a Constructor');

		this.#rule.instanceof.value = value;
		this.#rule.instanceof.flag = true;

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
		if(data instanceof Type.Object) {
			if(this.#rule.min.flag && Object.keys(data).length < this.#rule.min.value)
				throw new TypeError('Expected data.length to be at least ' + this.#rule.min.value);

			if(this.#rule.max.flag && Object.keys(data).length > this.#rule.max.value)
				throw new TypeError('Expected data.length to be at most ' + this.#rule.max.value);

			if(this.#rule.instanceof.flag && !(data instanceof this.#rule.instanceof.value))
				throw new TypeError('Expected data to be instanceof ' + this.#rule.instanceof.value.name);

			if(this.#rule.schema.flag) {
				Object.keys(this.#rule.schema.value).forEach(key => {
					try {
						data[key] = this.#rule.schema.value[key].parseSync(data[key]);
					}
					catch(error) {
						throw error;
					}
				});
			}

			if(!this.#rule.preserve.flag && this.#rule.schema.flag)
				Object.keys(data)
					.filter(key => !Object.keys(this.#rule.schema.value).includes(key))
					.forEach(key => delete data[key]);

			return data;
		}
		else {
			if(this.#rule.required.flag) {
				if(this.#rule.default.flag)
					return this.#rule.default.value;
				else
					throw new Error('Expected data to be an Object');
			}
			else {
				return null;
			}
		}
	}
}

module.exports = ObjectValidator;