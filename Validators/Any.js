const Rule = require('../Util/Rule');

class Any {
	constructor() {
		this._required = new Rule();
		this._default = new Rule();
	}

	required() {
		this._required.flag = true;

		return this;
	}
	default(value) {
		this._default.value = value;
		this._default.flag = true;

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
		return data;
	}
}

module.exports = Any;