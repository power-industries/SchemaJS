const Type = require('@power-industries/typejs');
const Rule = require('../Util/Rule');
const Any = require('./Any');

class ObjectValidator extends Any {
	constructor() {
		super();

		this._preserve = new Rule();
		this._min = new Rule();
		this._max = new Rule();
		this._schema = new Rule();
		this._instanceof = new Rule();
	}

	default(value) {
		if(!(value instanceof Type.Object))
			throw new TypeError('Expected value to be an Object');

		return super.default(value);
	}
	preserve() {
		this._preserve.flag = true;

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
	schema(value) {
		if(!(value instanceof Type.Object))
			throw new TypeError('Expected value to be an Object of Validators');

		Object.keys(value).forEach(key => {
			if(!(value[key] instanceof Any))
				throw new TypeError('Expected value to be an Object of Validator');
		});

		this._schema.value = value;
		this._schema.flag = true;

		return this;
	}
	instanceof(value) {
		if(!(value instanceof Type.Function))
			throw new TypeError('Expected value to be a Constructor');

		this._instanceof.value = value;
		this._instanceof.flag = true;

		return this;
	}

	parseSync(data) {
		if(data instanceof Type.Object) {
			if(this._min.flag && Object.keys(data).length < this._min.value)
				throw new TypeError('Expected data.length to be at least ' + this._min.value);

			if(this._max.flag && Object.keys(data).length > this._max.value)
				throw new TypeError('Expected data.length to be at most ' + this._max.value);

			if(this._instanceof.flag && !(data instanceof this._instanceof.value))
				throw new TypeError('Expected data to be instanceof ' + this._instanceof.value.name);

			if(this._schema.flag) {
				Object.keys(this._schema.value).forEach(key => {
					data[key] = this._schema.value[key].parseSync(data[key]);
				});
			}

			if(!this._preserve.flag && this._schema.flag)
				Object.keys(data)
					.filter(key => !Object.keys(this._schema.value).includes(key))
					.forEach(key => delete data[key]);

			return data;
		}
		else {
			if(this._required.flag) {
				if(this._default.flag)
					return this._default.value;
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