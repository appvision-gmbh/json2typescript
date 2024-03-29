/**
 * Enum for the operation mode of a JsonConvert instance.
 *
 * The values should be used as follows:
 * - DISABLE: json2typescript will be disabled, no type checking or mapping is done
 * - ENABLE: json2typescript is enabled, but only errors are logged
 * - LOGGING: json2typescript is enabled and detailed information is logged
 *
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export enum OperationMode {
    DISABLE = 0,
    ENABLE = 1,
    LOGGING = 2
};

/**
 * Enum for the property matching mode of a JsonConvert instance.
 *
 * The values should be used as follows:
 * - CASE_STRICT: JSON properties need to match exactly the names in the decorators
 * - CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
 *
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export enum PropertyMatchingRule {
    CASE_STRICT = 1,
    CASE_INSENSITIVE = 2
};

/**
 * Enum for the value checking mode of a JsonConvert instance for the serialization and deserialization.
 *
 * The values should be used as follows:
 * - ALLOW_NULL: all given values in the JSON are allowed to be null
 * - ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
 * - DISALLOW_NULL: no null values are tolerated in the JSON
 *
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export enum ValueCheckingMode {
    ALLOW_NULL = 1,
    ALLOW_OBJECT_NULL = 2,
    DISALLOW_NULL = 3
};


/**
 * Enum for the property converting mode of a property (de)serialized with JsonConvert.
 *
 * The converting mode defines what happens for nullable types.
 * Nullable types are either missing (in JSON), undefined (in TypeScript) or null (both).
 *
 * The setting overrides the behavior of the ValueCheckingMode for a specific property.
 *
 * The values should be used as follows:
 * - MAP_NULLABLE: a nullable property is passed to the mapper, type is normally checked
 * - IGNORE_NULLABLE: the property is never passed if missing, undefined or null
 * - PASS_NULLABLE: the property is passed and the given type for the mapping is ignored
 *
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export enum PropertyConvertingMode {
    MAP_NULLABLE = 0,
    IGNORE_NULLABLE = 1,
    PASS_NULLABLE = 2,
};
