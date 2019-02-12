/**
 * Offers a simple API for mapping JSON objects to TypeScript/JavaScript classes and vice versa.
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation on NPM
 */
export declare class JsonConvert {
    /**
     * Determines how the JsonConvert class instance should operate.
     *
     * You may assign three different values:
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
     * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
     * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
     */
    private _operationMode;
    /**
     * Determines how the JsonConvert class instance should operate.
     *
     * You may assign three different values:
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
     * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
     * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
     * @returns {number}
     */
    /**
    * Determines how the JsonConvert class instance should operate.
    *
    * You may assign three different values:
    * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
    * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
    * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
    * @param value
    */
    operationMode: number;
    /**
     * Determines which types are allowed to be null.
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
     */
    private _valueCheckingMode;
    /**
     * Determines which types are allowed to be null.
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
     *
     * @returns {number}
     */
    /**
    * Determines which types are allowed to be null.
    *
    * You may assign three different values:
    * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
    * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
    * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
    *
    * @param value
    */
    valueCheckingMode: number;
    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     */
    private _ignorePrimitiveChecks;
    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     *
     * @returns {boolean}
     */
    /**
    * Determines whether primitive types should be checked.
    * If true, it will be allowed to assign primitive to other primitive types.
    *
    * @param value
    */
    ignorePrimitiveChecks: boolean;
    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
     */
    private _propertyMatchingRule;
    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
     * @returns {number}
     */
    /**
    * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
    *
    * You may assign the following values:
    * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
    * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
    * @param value
    */
    propertyMatchingRule: number;
    /**
     * Constructor.
     *
     * To learn more about the params, check the documentation of the equally named class properties.
     *
     * @param operationMode optional param (default: OperationMode.ENABLE)
     * @param valueCheckingMode optional param (default: ValueCheckingMode.ALLOW_OBJECT_NULL)
     * @param ignorePrimitiveChecks optional param (default: false)
     * @param propertyMatchingRule optional param (default: PropertyMatchingRule.CASE_STRICT)
     */
    constructor(operationMode?: number, valueCheckingMode?: number, ignorePrimitiveChecks?: boolean, propertyMatchingRule?: number);
    /**
     * Tries to serialize a TypeScript object or array of objects to JSON.
     *
     * @param data object or array of objects
     *
     * @returns the JSON object
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serialize<T>(data: T | T[]): any | any[];
    /**
     * Tries to serialize a TypeScript object to a JSON object.
     *
     * @param instance TypeScript instance
     *
     * @returns the JSON object
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeObject<T>(instance: T): any;
    /**
     * Tries to serialize a TypeScript array to a JSON array.
     *
     * @param instanceArray array of TypeScript instances
     *
     * @returns the JSON array
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeArray<T>(instanceArray: T[]): any[];
    /**
     * Tries to deserialize given JSON to a TypeScript object or array of objects.
     *
     * @param json the JSON as object or array
     * @param classReference the class reference
     *
     * @returns the deserialized data (TypeScript instance or array of TypeScript instances)
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserialize<T>(json: any, classReference: {
        new (): T;
    }): T | T[];
    /**
     * Tries to deserialize a JSON object to a TypeScript object.
     *
     * @param jsonObject the JSON object
     * @param classReference the class reference
     *
     * @returns the deserialized TypeScript instance
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeObject<T>(jsonObject: any, classReference: {
        new (): T;
    }): T;
    /**
     * Tries to deserialize a JSON array to a TypeScript array.
     *
     * @param jsonArray the JSON array
     * @param classReference the object class
     *
     * @returns the deserialized array of TypeScript instances
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeArray<T>(jsonArray: any[], classReference: {
        new (): T;
    }): T[];
    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param classPropertyName the property name
     * @param json the JSON object
     *
     * @throws throws an Error in case of failure
     */
    private serializeObject_loopProperty;
    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param classPropertyName the property name
     * @param json the JSON object
     *
     * @throws throws an Error in case of failure
     */
    private deserializeObject_loopProperty;
    /**
     * Gets the mapping options of a given class property.
     *
     * @param instance any class instance
     * @param {string} propertyName any property name
     *
     * @returns {MappingOptions|null}
     */
    private getClassPropertyMappingOptions;
    /**
     * Compares the type of a given value with an internal expected json type.
     * Either returns the resulting value or throws an exception.
     *
     * @param expectedJsonType the expected json type for the property
     * @param value the property value to verify
     * @param serialize optional param (default: false), if given, we are in serialization mode
     *
     * @returns returns the resulted mapped property
     *
     * @throws an error in case of failure
     */
    private verifyProperty;
    /**
     * Gets the value of an object for a given value.
     * If the object does not have the specific key, an Error is thrown.
     *
     * @param data
     * @param key
     *
     * @returns returns the value
     *
     * @throws an Error in case of the key was not found in the object
     */
    private getObjectValue;
    /**
     * Returns a string representation of the expected json type.
     *
     * @param expectedJsonType the expected type given from the decorator
     *
     * @returns {string} the string representation
     */
    private getExpectedType;
    /**
     * Returns a string representation of the JSON value type.
     *
     * @param jsonValue the JSON value
     *
     * @returns {string} the string representation
     */
    private getJsonType;
    /**
     * Returns a string representation of the true TypeScript type.
     *
     * @param trueValue the true value
     *
     * @returns {string} the string representation
     */
    private getTrueType;
}
