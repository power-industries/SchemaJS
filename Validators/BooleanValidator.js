const Validator = require('./Validator.base');
const Type = require('@power-industries/typejs');

class BooleanValidator extends Validator {
	constructor() {
		super();

		this._rule = {
			required: {
				flag: false
			},
			equals: {
				flag: false,
				value: null
			},
			default: {
				flag: false,
				value: null
			}
		};
	}

	required() {
		this._rule.required.flag = true;

		return this;
	};
	equals(value) {
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

		this._rule.equals.value = value;
		this._rule.equals.flag = true;

		return this;
	};
	default(value) {
		if(!(value instanceof Type.Boolean))
			throw new TypeError('Expected value to be a Boolean');

		this._rule.default.value = value;
		this._rule.default.flag = true;

		return this;
	};

	validate(data) {
		return new Promise((resolve, reject) => {
			if(data instanceof Type.Boolean) {
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
	};
	validateSync(data) {
		if(data instanceof Type.Boolean) {
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
	};

	parse(data) {
		return new Promise((resolve, reject) => {
			if(data instanceof Type.Boolean) {
				if(this._rule.equals.flag && data !== this._rule.equals.value)
					return reject(new Error('Expected data to equal ' + this._rule.equals.value));

				return resolve(data);
			}
			else {
				if(this._rule.required.flag) {
					if(this._rule.default.flag)
						return resolve(this._rule.default.value);
					else
						return reject(new Error('Expected data to be a Boolean'));
				}
				else {
					return resolve(null);
				}
			}
		});
	};
	parseSync(data) {
		if(data instanceof Type.Boolean) {
			if(this._rule.equals.flag && data !== this._rule.equals.value)
				throw new Error('Expected data to equal ' + this._rule.equals.value);

			return data;
		}
		else {
			if(this._rule.required.flag) {
				if(this._rule.default.flag)
					return this._rule.default.value;
				else
					throw new Error('Expected data to be a Boolean');
			}
			else {
				return null;
			}
		}
	};
}

module.exports = BooleanValidator;