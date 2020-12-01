/**
 * The Validator base class - should not be instantiated
 * @class
 */
class Validator {
	/**
	 * A method converting the active Rules in the Validator into a JSON-compatible Object
	 * Should return an Object
	 * Has to be overridden by derived Validators
	 * @abstract
	 * @throws {ReferenceError} - Throws a TypeError if called without being overridden
	 */
	toJSON() {
		throw new ReferenceError('Method toJSON not defined');
	}

	/**
	 * A static method converting a JSON-compatible Object into an instance of the current Validator
	 * Should return a derived instance of Validator
	 * Has to be overridden by derived Validators
	 * @abstract
	 * @throws {ReferenceError} - Throws a TypeError if called without being overridden
	 */
	fromJSON() {
		throw new ReferenceError('Method fromJSON not defined');
	}

	/**
	 * A Method used for validating data asynchronously
	 * @param data {*} - The data to validate
	 * @returns {Promise} - A Promise which
	 * 		resolves to undefined on success
	 * 		rejects to undefined on failure
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
	 * A method used for validating data synchronously
	 * @param data {*} - The data to validate
	 * @returns {Boolean} - Returns
	 * 		true on success
	 * 		false on failure
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
	 * A method for parsing data asynchronously
	 * @param data {*} - The data to parse
	 * @returns {Promise<*>} - A Promise which
	 * 		resolves to the parsed data on success
	 * 		rejects to a ParseError on failure
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
	 * A method for parsing data synchronously
	 * Has to be overridden by derived Validators
	 * @abstract
	 * @throws {ReferenceError} - Throws a TypeError if called without being overridden
	 */
	parseSync(data) {
		throw new ReferenceError('Method parseSync not defined');
	}
}

module.exports = Validator;