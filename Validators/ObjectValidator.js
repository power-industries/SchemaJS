const Validator = require('./Validator.base');
const Type = require('@power-industries/typejs');

class ObjectValidator extends Validator {
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
			schema: {
				flag: false,
				value: null
			},
			preserveUnknown: {
				flag: false
			},
			instanceof: {
				flag: false,
				value: null,
				name: null
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
	schema(value) {
		if(!(value instanceof Type.Object))
			throw new TypeError('Expected value to be an Object');

		Object.keys(value).forEach(key => {
			if(!(value[key] instanceof Validator))
				throw new TypeError('Expected value[' + key + '] to be a Validator');
		});

		this._rule.schema.value = value;
		this._rule.schema.flag = true;

		return this;
	}
	preserveUnknown() {
		this._rule.preserveUnknown.flag = true;

		return this;
	}
	instanceof(value, name) {
		if(!(value instanceof Type.Function))
			throw new TypeError('Expected value to be a Constructor');

		if(!(name instanceof Type.String))
			throw new TypeError('Expected name to be a String');

		this._rule.instanceof.value = value;
		this._rule.instanceof.name = name;
		this._rule.instanceof.flag = true;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.Object))
			throw new TypeError('Expected value to be an Object');

		this._rule.default.value = value;
		this._rule.default.flag = true;

		return this;
	}

	validate(data) {
		return new Promise((resolve, reject) => {
			if (data instanceof Type.Object) {
				if (this._rule.min.flag && Object.keys(data).length < this._rule.min.value)
					return reject();

				if (this._rule.max.flag && Object.keys(data).length > this._rule.max.value)
					return reject();

				if (this._rule.instanceof.flag && !(data instanceof this._rule.instanceof.value))
					return reject();

				if (this._rule.schema.flag) {
					let result = true;

					Object.keys(this._rule.schema.value).forEach(key => {
						result &= this._rule.schema.value[key].validateSync(data[key]);
					});

					if (!result)
						return reject();
				}

				return resolve();
			} else {
				if (this._rule.required.flag) {
					if (this._rule.default.flag)
						return resolve();
					else
						return reject();
				} else {
					return resolve();
				}
			}
		});
	}
	validateSync(data) {
		if(data instanceof Type.Object) {
			if(this._rule.min.flag && Object.keys(data).length < this._rule.min.value)
				return false;

			if(this._rule.max.flag && Object.keys(data).length > this._rule.max.value)
				return false;

			if(this._rule.instanceof.flag && !(data instanceof this._rule.instanceof.value))
				return false;

			if(this._rule.schema.flag) {
				let result = true;

				Object.keys(this._rule.schema.value).forEach(key => {
					result &= this._rule.schema.value[key].validateSync(data[key]);
				});

				if (!result)
					return false;
			}

			return true;
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
			if(data instanceof Type.Object) {
				if(this._rule.min.flag && Object.keys(data).length < this._rule.min.value)
					return reject(new Error('Expected count of data to be larger than or equal to ' + this._rule.min.value));

				if(this._rule.max.flag && Object.keys(data).length > this._rule.max.value)
					return reject(new Error('Expected count of data to be smaller than or equal to ' + this._rule.max.value));

				if(this._rule.instanceof.flag && !(data instanceof this._rule.instanceof.value))
					return reject(new Error('Expected data to be instanceof ' + this._rule.instanceof.name));

				if(this._rule.schema.flag) {
					try {
						Object.keys(this._rule.schema.value).forEach(key => {
							this._rule.schema.value[key].parse(data[key])
								.then((result) => {
									data[key] = result;
								})
								.catch((error) => {
									throw error;
								});
						});
					}
					catch (error) {
						return reject(error);
					}
				}

				if(!this._rule.preserveUnknown.flag && this._rule.schema.flag) {
					Object.keys(data)
						.filter(key => !Object.keys(this._rule.schema.value).includes(key))
						.forEach(key => delete data[key]);
				}

				return resolve(data);
			}
			else {
				if(this._rule.required.flag) {
					if(this._rule.default.flag)
						return this._rule.default.value;
					else
						throw new Error('Expected data to be an Object');
				}
				else {
					return null;
				}
			}
		});
	}
	parseSync(data) {
		if(data instanceof Type.Object) {
			if(this._rule.min.flag && Object.keys(data).length < this._rule.min.value)
				throw new Error('Expected count of data to be larger than or equal to ' + this._rule.min.value);

			if(this._rule.max.flag && Object.keys(data).length > this._rule.max.value)
				throw new Error('Expected count of data to be smaller than or equal to ' + this._rule.max.value);

			if(this._rule.instanceof.flag && !(data instanceof this._rule.instanceof.value))
				throw new Error('Expected data to be instanceof ' + this._rule.instanceof.name);

			if(this._rule.schema.flag) {
				try {
					Object.keys(this._rule.schema.value).forEach(key => {
						data[key] = this._rule.schema.value[key].parseSync(data[key]);
					});
				}
				catch (error) {
					throw error;
				}
			}

			if(!this._rule.preserveUnknown.flag && this._rule.schema.flag) {
				Object.keys(data)
					.filter(key => !Object.keys(this._rule.schema.value).includes(key))
					.forEach(key => delete data[key]);
			}

			return data;
		}
		else {
			if(this._rule.required.flag) {
				if(this._rule.default.flag)
					return this._rule.default.value;
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