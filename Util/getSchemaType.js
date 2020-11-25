const Type = require('@power-industries/typejs');

module.exports = function getSchemaType(schema) {
	if (!(schema instanceof Type.Object))
		throw new TypeError('Expected schema to be an Object');

	if(!(schema['type'] instanceof Type.String))
		throw new TypeError('Expected schema.type to be a String');

	return schema['type'].toLowerCase();
}