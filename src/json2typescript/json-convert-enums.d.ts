/**
 * Enum for the operation mode of a JsonConvert instance.
 *
 * The values should be used as follows:
 * - DISABLE: json2typescript will be disabled, no type checking or mapping is done
 * - ENABLE: json2typescript is enabled, but only errors are logged
 * - LOGGING: json2typescript is enabled and detailed information is logged
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export declare enum OperationMode {
    DISABLE = 0,
    ENABLE = 1,
    LOGGING = 2
}
/**
 * Enum for the property matching mode of a JsonConvert instance.
 *
 * The values should be used as follows:
 * - CASE_STRICT: JSON properties need to match exactly the names in the decorators
 * - CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export declare enum PropertyMatchingRule {
    CASE_STRICT = 1,
    CASE_INSENSITIVE = 2
}
/**
 * Enum for the value checking mode of a JsonConvert instance.
 *
 * The values should be used as follows:
 * - ALLOW_NULL: all given values in the JSON are allowed to be null
 * - ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
 * - DISALLOW_NULL: no null values are tolerated in the JSON
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export declare enum ValueCheckingMode {
    ALLOW_NULL = 1,
    ALLOW_OBJECT_NULL = 2,
    DISALLOW_NULL = 3
}
