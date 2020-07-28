const Validator = require('./Validator.base');
const Type = require('@power-industries/typejs');

class ArrayValidator extends Validator {
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
			has: {
				flag: false,
				value: null
			},
			allowedItems: {
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
	has(value) {
		if(!(value instanceof Validator))
			throw new TypeError('Expected value to be a Validator');

		this._rule.has.value = value;
		this._rule.has.flag = true;

		return this;
	}
	allowedItems(value) {
		if(!(value instanceof Type.Array))
			throw new TypeError('Expected value to be an Array of Validators');

		let result = true;

		value.forEach(val => {
			if(!(val instanceof Validator))
				result &= false;
		});

		if(!result)
			throw new TypeError('Expected value to be an Array of Validators');

		this._rule.allowedItems.value = value;
		this._rule.allowedItems.flag = true;

		return this;
	}
	default(value) {
		if(!(value instanceof Type.Array))
			throw new TypeError('Expected value to be an Array');

		this._rule.default.value = value;
		this._rule.default.flag = true;

		return this;
	}

	validate(data) {
		return new Promise((resolve, reject) => {
			if(data instanceof Type.Array) {
				if(data.find((element) => {return this._rule.has.value.validateSync(element)}) === undefined)
					return reject();

				if(this._rule.max.flag && data.length > this._rule.max.value)
					return reject();

				if(this._rule.min.flag && data.length < this._rule.min.value)
					return reject();

				try {
					data.forEach((element) => {
						let result = false;

						this._rule.allowedItems.value.forEach((value) => {
							result |= value.validateSync(element);
						});

						if (!result)
							throw new Error('Invalid element given');
					});
				}
				catch (error) {
					return reject();
				}

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
		if(data instanceof Type.Array) {
			if(this._rule.has.flag && data.find((element) => {return this._rule.has.value.validateSync(element)}) === undefined)
				return false;

			if(this._rule.max.flag && data.length > this._rule.max.value)
				return false;

			if(this._rule.min.flag && data.length < this._rule.min.value)
				return false;

			try {
				data.forEach((element) => {
					let result = false;

					this._rule.allowedItems.value.forEach((value) => {
						result |= value.validateSync(element);
					});

					if (!result)
						throw new Error('Invalid element given');
				});
			}
			catch (error) {
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
			if(data instanceof Type.Array) {
				if(data.find((element) => {return this._rule.has.value.validateSync(element)}) === undefined)
					return reject(new Error('Expected data to include a specific value'));

				if(this._rule.max.flag && data.length > this._rule.max.value)
					return reject(new Error('Expected length of data to be smaller than or equal to ' + this._rule.max.value));

				if(this._rule.min.flag && data.length < this._rule.min.value)
					return reject(new Error('Expected length of data to be larger than or equal to ' + this._rule.min.value));

				try {
					data.forEach((element) => {
						let result = false;

						this._rule.allowedItems.value.forEach((value) => {
							result |= value.validateSync(element);
						});

						if (!result)
							throw new Error('Invalid element given');
					});
				}
				catch (error) {
					return reject(error);
				}

				return resolve(data);
			}
			else {
				if(this._rule.required.flag) {
					if(this._rule.default.flag)
						return resolve(this._rule.default.value);
					else
						return reject(new Error('Expected data to be an Array'));
				}
				else {
					return resolve(null);
				}
			}
		});
	}
	parseSync(data) {
		if(data instanceof Type.Array) {
			if(data.find((element) => {return this._rule.has.value.validateSync(element)}) === undefined)
				throw new Error('Expected data to include a specific value');

			if(this._rule.max.flag && data.length > this._rule.max.value)
				throw new Error('Expected length of data to be smaller than or equal to ' + this._rule.max.value);

			if(this._rule.min.flag && data.length < this._rule.min.value)
				throw new Error('Expected length of data to be larger than or equal to ' + this._rule.min.value);

			try {
				data.forEach((element) => {
					let result = false;

					this._rule.allowedItems.value.forEach((value) => {
						result |= value.validateSync(element);
					});

					if (!result)
						throw new Error('Invalid element given');
				});
			}
			catch (error) {
				throw error;
			}

			return data;
		}
		else {
			if(this._rule.required.flag) {
				if(this._rule.default.flag)
					return this._rule.default.value;
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