const ParseError = require('../Errors/ParseError.class');

class Validator {
	constructor() {}

	parseSync() {
		throw new ParseError('Method "parseSync" not implemented');
	}
}

module.exports = Validator;