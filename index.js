const BooleanValidator = require('./Validators/BooleanValidator');
const NumberValidator = require('./Validators/NumberValidator');
const StringValidator = require('./Validators/StringValidator');
const ArrayValidator = require('./Validators/ArrayValidator');
const ObjectValidator = require('./Validators/ObjectValidator');

module.exports = {
	Boolean: () => {return new BooleanValidator();},
	Number: () => {return new NumberValidator();},
	String: () => {return new StringValidator();},
	Array: () => {return new ArrayValidator();},
	Object: () => {return new ObjectValidator();}
};

new ArrayValidator()
	.item(new NumberValidator()
		.required()
		.integer()
		.min(0)
		.max(100)
	)
	.parseSync([true, 2, 3]);