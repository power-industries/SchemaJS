const Type = require('@power-industries/typejs');
const SchemaError = require('./Errors/SchemaError');

/**
 * getSchemaType is a function checking if schema is an Object and has a property called type which has to be a String
 * @param schema {Object} - The Schema to check
 * @param schema.type {String} - The SchemaType to check
 * @returns {String} - Returns schema.type
 * @throws {SchemaError} - Throws a TypeError if schema is not an Object
 * @throws {SchemaError} - Throws a TypeError if schema.type is not a String
 */
const getSchemaType = (schema) => {
	if (!(schema instanceof Type.Object))
		throw new SchemaError('Expected schema to be an Object');

	if(!(schema['type'] instanceof Type.String))
		throw new SchemaError('Expected schema.type to be a String');

	return schema['type'].toLowerCase();
};

module.exports = getSchemaType;