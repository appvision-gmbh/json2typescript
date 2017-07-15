"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enum for the value checking mode of a JsonConvert class instance.
 *
 * The values should be used as follows:
 * - ALLOW_NULL: all given values in the JSON are allowed to be null
 * - ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
 * - DISALLOW_NULL: no null values are tolerated in the JSON
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
var ValueCheckingMode;
(function (ValueCheckingMode) {
    ValueCheckingMode[ValueCheckingMode["ALLOW_NULL"] = 1] = "ALLOW_NULL";
    ValueCheckingMode[ValueCheckingMode["ALLOW_OBJECT_NULL"] = 2] = "ALLOW_OBJECT_NULL";
    ValueCheckingMode[ValueCheckingMode["DISALLOW_NULL"] = 3] = "DISALLOW_NULL";
})(ValueCheckingMode = exports.ValueCheckingMode || (exports.ValueCheckingMode = {}));
;
/**
 * Enum for the debug mode of a JsonConvert class instance.
 *
 * The values should be used as follows:
 * - DISABLE: json2typescript will be disabled, could be used in production
 * - ENABLE: json2typescript is enabled, but only errors are logged
 * - LOGGING: json2typescript is enabled and detailed information is logged
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
var DebugMode;
(function (DebugMode) {
    DebugMode[DebugMode["DISABLE"] = 0] = "DISABLE";
    DebugMode[DebugMode["ENABLE"] = 1] = "ENABLE";
    DebugMode[DebugMode["LOGGING"] = 2] = "LOGGING";
})(DebugMode = exports.DebugMode || (exports.DebugMode = {}));
;
/**
 * Offers a simple API for mapping json objects to TypeScript/JavaScript classes and vice versa.
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
var JsonConvert = (function () {
    function JsonConvert() {
        /**
         * Determines whether debugging info is shown in console.
         *
         * You may assign three different values:
         * - DebugMode.DISABLE: json2typescript will be disabled, could be used in production
         * - DebugMode.ENABLE: json2typescript is enabled, but only errors are logged
         * - DebugMode.LOGGING: json2typescript is enabled and detailed information is logged
         */
        this.debugMode = DebugMode.ENABLE;
        /**
         * Determines which types are allowed to be null.
         *
         * You may assign three different values:
         * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
         * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
         * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
         */
        this.valueCheckingMode = ValueCheckingMode.ALLOW_OBJECT_NULL;
        /**
         * Determines whether primitive types should be checked.
         * If true, it will be allowed to assign primitive to other primitive types.
         */
        this.ignorePrimitiveChecks = false;
    }
    /**
     * Constructor.
     *
     * Check the equally named class properties to learn more about the meaning of the params.
     * @param debugMode optional param (default: DebugMode.ENABLE_SILENTLY)
     * @param valueCheckingMode optional param (default: ValueCheckingMode.ALLOW_OBJECT_NULL)
     * @param ignorePrimitiveChecks optional param (default: false)
     */
    JsonConvert.prototype.construct = function (debugMode, valueCheckingMode, ignorePrimitiveChecks) {
        if (debugMode in DebugMode)
            this.debugMode = debugMode;
        if (valueCheckingMode in ValueCheckingMode)
            this.valueCheckingMode = valueCheckingMode;
        if (ignorePrimitiveChecks)
            this.ignorePrimitiveChecks = ignorePrimitiveChecks;
    };
    /**
     * Tries to serialize a JavaScript object to a JSON string.
     * @param instance any instance of a class
     * @returns {string} the JSON string
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.serializeObject = function (instance) {
        if (this.debugMode === DebugMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript object:");
            console.log(instance);
        }
        var jsonString = JSON.stringify(instance);
        if (this.debugMode === DebugMode.LOGGING) {
            console.log("Returning JSON string:");
            console.log(jsonString);
            console.log("----------");
        }
        return jsonString;
    };
    /**
     * Tries to deserialize given data to a TypeScript class.
     * @param json the JSON as string, object or array
     * @param classObject the object class
     * @returns {any} the deserialized data (object instance or array of object instances)
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.deserialize = function (json, classObject) {
        if (typeof json === "string")
            return this.deserializeString(json, classObject);
        if (json.constructor === Array)
            return this.deserializeArray(json, classObject);
        if (typeof json === "object")
            return this.deserializeObject(json, classObject); // must be last due to the fact that an array is an object in TypeScript!
        throw new Error("Fatal error in JsonConvert. " +
            "Passed parameter json in JsonConvert.deserialize() is not a valid json format (string, object or array).");
    };
    ;
    /**
     * Tries to deserialize a JSON string to a TypeScript class.
     * @param jsonString the JSON string
     * @param classObject the object class
     * @returns {any} the deserialized object instance
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.deserializeString = function (jsonString, classObject) {
        if (typeof (jsonString) !== "string") {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not of type string.");
        }
        if (this.debugMode === DebugMode.LOGGING) {
            console.log("Receiving JSON string:");
            console.log(jsonString);
        }
        // Create an object from json string
        var jsonData = JSON.parse(jsonString);
        if (typeof (jsonData) === 'object') {
            if (jsonData instanceof Array) {
                return this.deserializeArray(jsonData, classObject);
            }
            else {
                return this.deserializeObject(jsonData, classObject);
            }
        }
        else {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not a valid json string.");
        }
    };
    /**
     * Tries to deserialize a JSON object to a TypeScript class.
     * @param jsonObject the JSON object
     * @param classObject the object class
     * @returns {any} the deserialized object instance
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.deserializeObject = function (jsonObject, classObject) {
        if (typeof (jsonObject) !== "object" || jsonObject instanceof Array) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object.");
        }
        if (this.debugMode === DebugMode.DISABLE) {
            return jsonObject;
        }
        if (this.debugMode === DebugMode.LOGGING) {
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }
        var classInstance = new classObject();
        // Loop through all initialized class properties
        for (var _i = 0, _a = Object.keys(classInstance); _i < _a.length; _i++) {
            var propertyKey = _a[_i];
            this.deserializeObject_loopProperty(classInstance, propertyKey, jsonObject);
        }
        if (this.debugMode === DebugMode.LOGGING) {
            console.log("Returning CLASS instance:");
            console.log(classInstance);
        }
        return classInstance;
    };
    /**
     * Tries to deserialize a JSON array to a TypeScript class array.
     * @param jsonArray the JSON array
     * @param classObject the object class
     * @returns {any[]} the deserialized array of object instances
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.deserializeArray = function (jsonArray, classObject) {
        if (typeof (jsonArray) !== "object" || jsonArray instanceof Array === false) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array.");
        }
        if (this.debugMode === DebugMode.DISABLE) {
            return jsonArray;
        }
        if (this.debugMode === DebugMode.LOGGING) {
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }
        var array = [];
        // Loop through all array elements
        for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
            var jsonObject = jsonArray_1[_i];
            array.push(this.deserializeObject(jsonObject, classObject));
        }
        if (this.debugMode === DebugMode.LOGGING) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
        }
        return array;
    };
    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     * @param classInstance the instance of the class
     * @param propertyKey the property
     * @param json the JSON object
     * @throws throws an expection in case of failure
     */
    JsonConvert.prototype.deserializeObject_loopProperty = function (classInstance, propertyKey, json) {
        // Get the mapping array
        var mapping = classInstance["__jsonconvert__mapping__"];
        // Check if a object-JSON mapping is possible for a property
        if (this.deserializeObject_propertyHasDecorator(mapping, propertyKey) === false) {
            // Make sure values are not overridden by undefined json values
            if (typeof (json[propertyKey]) !== "undefined")
                classInstance[propertyKey] = json[propertyKey];
            return;
        }
        // Get expected and real values
        var jsonKey = mapping[propertyKey]["jsonKey"];
        var expectedType = mapping[propertyKey]["type"];
        var isOptional = mapping[propertyKey]["optional"];
        var jsonValue = json[jsonKey];
        // Check if the json value exists
        if (typeof (jsonValue) === "undefined") {
            if (isOptional)
                return;
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + classInstance.constructor.name + "\" because the defined JSON property \"" + jsonKey + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey);
        }
        // Map the property
        try {
            classInstance[propertyKey] = this.deserializeObject_mapProperty(expectedType, jsonValue);
        }
        catch (e) {
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + classInstance.constructor.name + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tExpected type: \n\t\t" + this.deserializeObject_getExpectedType(expectedType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                "\tJSON type: \n\t\t" + this.deserializeObject_getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message + "\n");
        }
    };
    /**
     * Check if a class property has a decorator.
     * @param mapping the class-JSON mapping array
     * @param propertyKey the property key
     * @returns {boolean} true if the mapping exists, otherwise false
     */
    JsonConvert.prototype.deserializeObject_propertyHasDecorator = function (mapping, propertyKey) {
        return typeof (mapping) !== "undefined" && typeof (mapping[propertyKey]) !== "undefined";
    };
    /**
     * Tries to map a JSON property to a class property.
     * Checks the type of the JSON value and compares it to the expected value.
     * @param expectedType the expected type for the property indicated in the decorator
     * @param jsonValue the JSON object for the given property
     * @returns returns the resulted mapped property
     * @throws throws an expection in case of failure
     */
    JsonConvert.prototype.deserializeObject_mapProperty = function (expectedType, jsonValue) {
        // Map immediately if we don't care about the type
        if (typeof (expectedType) === "undefined" || expectedType === null || expectedType === Object) {
            return jsonValue;
        }
        // Check if attempt and expected was 1-d
        if (expectedType instanceof Array === false && jsonValue instanceof Array === false) {
            // Check the type
            if (expectedType.hasOwnProperty("__jsonconvert__mapping__")) {
                // Check if we have null value
                if (jsonValue === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                return this.deserializeObject(jsonValue, expectedType);
            }
            else if (expectedType === null || expectedType === Object || expectedType === undefined) {
                // Check if we have null value
                if (jsonValue === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                return jsonValue;
            }
            else if (expectedType === String || expectedType === Number || expectedType === Boolean) {
                // Check if we have null value
                if (jsonValue === null) {
                    if (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                // Check if the types match
                if ((expectedType === String && typeof (jsonValue) === "string") ||
                    (expectedType === Number && typeof (jsonValue) === "number") ||
                    (expectedType === Boolean && typeof (jsonValue) === "boolean")) {
                    return jsonValue;
                }
                else {
                    if (this.ignorePrimitiveChecks)
                        return jsonValue;
                    throw new Error("\tReason: JSON object does not match the expected primitive type.");
                }
            }
            else {
                throw new Error("\tReason: Expected type is unknown.");
            }
        }
        // Check if attempt and expected was n-d
        if (expectedType instanceof Array && jsonValue instanceof Array) {
            var array = [];
            // No data given, so return empty value
            if (jsonValue.length === 0) {
                return array;
            }
            // We obviously don't care about the type, so return the json value as is
            if (expectedType.length === 0) {
                return jsonValue;
            }
            // Loop through the data. Both expectedType and jsonValue are at least of length 1
            var autofillType = expectedType.length < jsonValue.length;
            for (var i = 0; i < jsonValue.length; i++) {
                if (autofillType && i >= expectedType.length)
                    expectedType[i] = expectedType[i - 1];
                array[i] = this.deserializeObject_mapProperty(expectedType[i], jsonValue[i]);
            }
            return array;
        }
        // Check if attempt was 1-d and expected was n-d
        if (expectedType instanceof Array && jsonValue instanceof Object) {
            var array = [];
            // No data given, so return empty value
            if (jsonValue.length === 0) {
                return array;
            }
            // We obviously don't care about the type, so return the json value as is
            if (expectedType.length === 0) {
                return jsonValue;
            }
            // Loop through the data. Both expectedType and jsonValue are at least of length 1
            var autofillType = expectedType.length < Object.keys(jsonValue).length;
            var i = 0;
            for (var key in jsonValue) {
                if (autofillType && i >= expectedType.length)
                    expectedType[i] = expectedType[i - 1];
                array[key] = this.deserializeObject_mapProperty(expectedType[i], jsonValue[key]);
                i++;
            }
            return array;
        }
        // Check if attempt was 1-d and expected was n-d
        if (expectedType instanceof Array) {
            if (jsonValue === null) {
                if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                    return null;
                else
                    throw new Error("\tReason: JSON value is null.");
            }
            throw new Error("\tReason: Expected type is array, but JSON value is non-array.");
        }
        // Check if attempt was n-d and expected as 1-d
        if (jsonValue instanceof Array) {
            throw new Error("\tReason: JSON value is array, but expected a non-array type.");
        }
        // All other attempts are fatal
        throw new Error("\tReason: Mapping failed because of an unknown error.");
    };
    /**
     * Returns a string representation of the expected type.
     * @param expectedType the expected type given from the decorator
     * @returns {string} the string representation
     */
    JsonConvert.prototype.deserializeObject_getExpectedType = function (expectedType) {
        var type = "";
        if (expectedType instanceof Array) {
            type = "[";
            for (var i = 0; i < expectedType.length; i++) {
                if (i > 0)
                    type += ",";
                type += this.deserializeObject_getExpectedType(expectedType[i]);
            }
            type += "]";
            return type;
        }
        else {
            if (expectedType === undefined || expectedType === null || expectedType === Object) {
                return "any";
            }
            else if (expectedType === String || expectedType == Boolean || expectedType == Number) {
                return (new expectedType()).constructor.name.toLowerCase();
            }
            else if (typeof expectedType === 'function') {
                return (new expectedType()).constructor.name;
            }
            else {
                return "?????";
            }
        }
    };
    /**
     * Returns a string representation of the JSON value.
     * @param jsonValue the JSON value
     * @returns {string} the string representation
     */
    JsonConvert.prototype.deserializeObject_getJsonType = function (jsonValue) {
        if (jsonValue === null)
            return "null";
        var type = "";
        if (jsonValue instanceof Array) {
            type = "[";
            for (var i = 0; i < jsonValue.length; i++) {
                if (i > 0)
                    type += ",";
                type += this.deserializeObject_getJsonType(jsonValue[i]);
            }
            type += "]";
            return type;
        }
        else {
            return typeof (jsonValue);
        }
    };
    return JsonConvert;
}());
exports.JsonConvert = JsonConvert;
/**
 * Decorator of a class that comes from a JSON object.
 * @param target the class
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
function JsonObject(target) {
    target["__jsonconvert__mapping__"] = [];
}
exports.JsonObject = JsonObject;
/**
 * Decorator of a class property that comes from a JSON object.
 * Use the following notation for the type:
 * Primitive type: String|Number|Boolean
 * Custom type: YourClassName
 * Array type: [String|Number|Boolean|YourClassName]
 * @param jsonKey the key in the expected JSON object
 * @param expectedType optional param (default: undefined), the expected type String|Boolean|Number|any
 * @param isOptional optional param (default: false), if true, the property does not have to be present in the json object
 * @returns {(target:any, key:string)=>void}
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
function JsonProperty(jsonKey, expectedType, isOptional) {
    return function (target, key) {
        if (typeof (target["__jsonconvert__mapping__"]) === "undefined") {
            target["__jsonconvert__mapping__"] = [];
        }
        if (typeof (isOptional) === "undefined") {
            isOptional = false;
        }
        target["__jsonconvert__mapping__"][key] = {
            "jsonKey": jsonKey,
            "type": expectedType,
            "optional": isOptional
        };
    };
}
exports.JsonProperty = JsonProperty;
