class Validator {
	/**
	 * @abstract
	 * @throws {ReferenceError}
	 */
	toJS() {
		throw new ReferenceError('Method toJS not defined');
	}

	/**
	 * @abstract
	 * @throws {ReferenceError}
	 */
	fromJS() {
		throw new ReferenceError('Method fromJS not defined');
	}

	/**
	 * @param data {*}
	 * @returns {Promise}
	 */
	validate(data) {
		return new Promise((resolve, reject) => {
			if(this.validateSync(data))
				return resolve();
			else
				return reject();
		});
	}

	/**
	 * @param data {*}
	 * @returns {Boolean}
	 */
	validateSync(data) {
		try {
			this.parseSync(data);
			return true;
		}
		catch (e) {
			return false;
		}
	}

	/**
	 * @param data {*}
	 * @returns {Promise<*>}
	 */
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

	/**
	 * @abstract
	 * @throws {ReferenceError}
	 */
	parseSync(data) {
		throw new ReferenceError('Method parseSync not defined');
	}
}

module.exports = Validator;