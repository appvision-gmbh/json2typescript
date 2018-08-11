"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_convert_enums_1 = require("./json-convert-enums");
var json_convert_options_1 = require("./json-convert-options");
var any_1 = require("./any");
/**
 * Offers a simple API for mapping JSON objects to TypeScript/JavaScript classes and vice versa.
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation on NPM
 */
var JsonConvert = /** @class */ (function () {
    /////////////////
    // CONSTRUCTOR //
    /////////////////
    /**
     * Constructor.
     *
     * To learn more about the params, check the documentation of the equally named class properties.
     *
     * @param operationMode optional param (default: OperationMode.ENABLE)
     * @param valueCheckingMode optional param (default: ValueCheckingMode.ALLOW_OBJECT_NULL)
     * @param ignorePrimitiveChecks optional param (default: false)
     */
    function JsonConvert(operationMode, valueCheckingMode, ignorePrimitiveChecks) {
        ////////////////
        // PROPERTIES //
        ////////////////
        /**
         * Determines how the JsonConvert class instance should operate.
         *
         * You may assign three different values:
         * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
         * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
         * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
         */
        this._operationMode = json_convert_enums_1.OperationMode.ENABLE;
        /**
         * Determines which types are allowed to be null.
         *
         * You may assign three different values:
         * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
         * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
         * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
         */
        this._valueCheckingMode = json_convert_enums_1.ValueCheckingMode.ALLOW_OBJECT_NULL;
        /**
         * Determines whether primitive types should be checked.
         * If true, it will be allowed to assign primitive to other primitive types.
         */
        this._ignorePrimitiveChecks = false;
        if (operationMode && operationMode in json_convert_enums_1.OperationMode)
            this.operationMode = operationMode;
        if (valueCheckingMode && valueCheckingMode in json_convert_enums_1.ValueCheckingMode)
            this.valueCheckingMode = valueCheckingMode;
        if (ignorePrimitiveChecks)
            this.ignorePrimitiveChecks = ignorePrimitiveChecks;
    }
    Object.defineProperty(JsonConvert.prototype, "operationMode", {
        /**
         * Determines how the JsonConvert class instance should operate.
         *
         * You may assign three different values:
         * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
         * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
         * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
         * @returns {number}
         */
        get: function () {
            return this._operationMode;
        },
        /**
         * Determines how the JsonConvert class instance should operate.
         *
         * You may assign three different values:
         * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
         * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
         * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
         * @param value
         */
        set: function (value) {
            if (value in json_convert_enums_1.OperationMode)
                this._operationMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonConvert.prototype, "valueCheckingMode", {
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
        get: function () {
            return this._valueCheckingMode;
        },
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
        set: function (value) {
            if (value in json_convert_enums_1.ValueCheckingMode)
                this._valueCheckingMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonConvert.prototype, "ignorePrimitiveChecks", {
        /**
         * Determines whether primitive types should be checked.
         * If true, it will be allowed to assign primitive to other primitive types.
         *
         * @returns {boolean}
         */
        get: function () {
            return this._ignorePrimitiveChecks;
        },
        /**
         * Determines whether primitive types should be checked.
         * If true, it will be allowed to assign primitive to other primitive types.
         *
         * @param value
         */
        set: function (value) {
            this._ignorePrimitiveChecks = value;
        },
        enumerable: true,
        configurable: true
    });
    ////////////////////
    // PUBLIC METHODS //
    ////////////////////
    /**
     * Tries to serialize a TypeScript object or array of objects to JSON.
     *
     * @param data object or array of objects
     *
     * @returns {any} the JSON object
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.serialize = function (data) {
        if (data === undefined) {
            if (this.valueCheckingMode === json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL) {
                throw new Error("Fatal error in JsonConvert. " +
                    "Passed parameter json in JsonConvert.serialize() is undefined. You have specified to disallow null values.");
            }
            else {
                return null;
            }
        }
        else if (data === null) {
            if (this.valueCheckingMode === json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL) {
                throw new Error("Fatal error in JsonConvert. " +
                    "Passed parameter json in JsonConvert.serialize() is undefined. You have specified to disallow null values.");
            }
            else {
                return null;
            }
        }
        else if (data) {
            if (data.constructor === Array)
                return this.serializeArray(data);
            if (typeof data === "object")
                return this.serializeObject(data); // must be last due to the fact that an array is an object in TypeScript!
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter json in JsonConvert.serialize() is not in valid format (object or array).");
        }
    };
    /**
     * Tries to serialize a TypeScript object to a JSON object.
     *
     * @param instance TypeScript instance
     *
     * @returns {any} the JSON object
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.serializeObject = function (instance) {
        if (typeof (instance) !== "object" || instance instanceof Array) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.serializeObject() is not of type object.");
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.DISABLE) {
            return instance;
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript instance:");
            console.log(instance);
        }
        var jsonObject = {};
        // Loop through all initialized class properties
        for (var _i = 0, _a = Object.keys(instance); _i < _a.length; _i++) {
            var propertyKey = _a[_i];
            this.serializeObject_loopProperty(instance, propertyKey, jsonObject);
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("Returning JSON object:");
            console.log(jsonObject);
            console.log("----------");
        }
        return jsonObject;
    };
    /**
     * Tries to serialize a TypeScript array to a JSON array.
     *
     * @param instanceArray array of TypeScript instances
     *
     * @returns {any[]} the JSON array
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.serializeArray = function (instanceArray) {
        if (typeof (instanceArray) !== "object" || instanceArray instanceof Array === false) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.serializeArray() is not of type array.");
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.DISABLE) {
            return instanceArray;
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript array:");
            console.log(instanceArray);
        }
        var jsonArray = [];
        // Loop through all array elements
        for (var _i = 0, instanceArray_1 = instanceArray; _i < instanceArray_1.length; _i++) {
            var classInstance = instanceArray_1[_i];
            jsonArray.push(this.serializeObject(classInstance));
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("Returning JSON array:");
            console.log(jsonArray);
            console.log("----------");
        }
        return jsonArray;
    };
    /**
     * Tries to deserialize given JSON to a TypeScript object or array of objects.
     *
     * @param json the JSON as object or array
     * @param classReference the class reference
     *
     * @returns {any} the deserialized data (TypeScript instance or array of TypeScript instances)
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.deserialize = function (json, classReference) {
        if (json === undefined) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter json in JsonConvert.deserialize() is undefined. This is not a valid JSON format.");
        }
        else if (json === null) {
            if (this.valueCheckingMode === json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL) {
                throw new Error("Fatal error in JsonConvert. " +
                    "Passed parameter json in JsonConvert.deserialize() is undefined. You have specified to disallow null values.");
            }
            else {
                return null;
            }
        }
        else if (json) {
            if (json.constructor === Array)
                return this.deserializeArray(json, classReference);
            if (typeof json === "object")
                return this.deserializeObject(json, classReference); // must be last due to the fact that an array is an object in TypeScript!
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter json in JsonConvert.deserialize() is not in valid JSON format (object or array).");
        }
    };
    ;
    /**
     * Tries to deserialize a JSON object to a TypeScript object.
     *
     * @param jsonObject the JSON object
     * @param classReference the class reference
     *
     * @returns {any} the deserialized TypeScript instance
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.deserializeObject = function (jsonObject, classReference) {
        if (typeof (jsonObject) !== "object" || jsonObject instanceof Array) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object.");
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.DISABLE) {
            return jsonObject;
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }
        var instance = new classReference();
        // Loop through all initialized class properties
        for (var _i = 0, _a = Object.keys(instance); _i < _a.length; _i++) {
            var propertyKey = _a[_i];
            this.deserializeObject_loopProperty(instance, propertyKey, jsonObject);
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("Returning CLASS instance:");
            console.log(instance);
            console.log("----------");
        }
        return instance;
    };
    /**
     * Tries to deserialize a JSON array to a TypeScript array.
     *
     * @param jsonArray the JSON array
     * @param classReference the object class
     *
     * @returns {any[]} the deserialized array of TypeScript instances
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    JsonConvert.prototype.deserializeArray = function (jsonArray, classReference) {
        if (typeof (jsonArray) !== "object" || jsonArray instanceof Array === false) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array.");
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.DISABLE) {
            return jsonArray;
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }
        var array = [];
        // Loop through all array elements
        for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
            var jsonObject = jsonArray_1[_i];
            array.push(this.deserializeObject(jsonObject, classReference));
        }
        if (this.operationMode === json_convert_enums_1.OperationMode.LOGGING) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
            console.log("----------");
        }
        return array;
    };
    /////////////////////
    // PRIVATE METHODS //
    /////////////////////
    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param classPropertyName the property name
     * @param json the JSON object
     *
     * @throws throws an expection in case of failure
     */
    JsonConvert.prototype.serializeObject_loopProperty = function (instance, classPropertyName, json) {
        // Check if a JSON-object mapping is possible for a property
        var mappingOptions = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }
        // Get expected and real values
        var jsonKey = mappingOptions.jsonPropertyName;
        var expectedJsonType = mappingOptions.expectedJsonType;
        var isOptional = mappingOptions.isOptional;
        var customConverter = mappingOptions.customConverter;
        var classInstancePropertyValue = instance[classPropertyName];
        // Check if the json value exists
        if (typeof (classInstancePropertyValue) === "undefined") {
            if (isOptional)
                return;
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance[json_convert_options_1.Settings.CLASS_IDENTIFIER] + "\" to JSON because the defined class property \"" + classPropertyName + "\" does not exist or is not defined:\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n");
        }
        // Map the property
        try {
            json[jsonKey] = customConverter !== null ? customConverter.serialize(classInstancePropertyValue) : this.verifyProperty(expectedJsonType, classInstancePropertyValue, true);
        }
        catch (e) {
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance[json_convert_options_1.Settings.CLASS_IDENTIFIER] + "\" to JSON because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tClass property value: \n\t\t" + classInstancePropertyValue + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tRuntime type: \n\t\t" + this.getTrueType(classInstancePropertyValue) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                e.message + "\n");
        }
    };
    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param classPropertyName the property name
     * @param json the JSON object
     *
     * @throws throws an expection in case of failure
     */
    JsonConvert.prototype.deserializeObject_loopProperty = function (instance, classPropertyName, json) {
        var mappingOptions = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }
        // Get expected and real values
        var jsonKey = mappingOptions.jsonPropertyName;
        var expectedJsonType = mappingOptions.expectedJsonType;
        var isOptional = mappingOptions.isOptional;
        var customConverter = mappingOptions.customConverter;
        var jsonValue = json[jsonKey];
        // Check if the json value exists
        if (typeof (jsonValue) === "undefined") {
            if (isOptional)
                return;
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + instance[json_convert_options_1.Settings.CLASS_IDENTIFIER] + "\" because the defined JSON property \"" + jsonKey + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n");
        }
        // Map the property
        try {
            instance[classPropertyName] = customConverter !== null ? customConverter.deserialize(jsonValue) : this.verifyProperty(expectedJsonType, jsonValue);
        }
        catch (e) {
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the JavaScript class \"" + instance[json_convert_options_1.Settings.CLASS_IDENTIFIER] + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                "\tJSON type: \n\t\t" + this.getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message + "\n\n");
        }
    };
    ////////////////////
    // HELPER METHODS //
    ////////////////////
    /**
     * Gets the mapping options of a given class property.
     *
     * @param instance any class instance
     * @param {string} propertyName any property name
     *
     * @returns {MappingOptions|null}
     */
    JsonConvert.prototype.getClassPropertyMappingOptions = function (instance, propertyName) {
        var mappings = instance[json_convert_options_1.Settings.MAPPING_PROPERTY];
        // Check if mapping is defined
        if (typeof (mappings) === "undefined")
            return null;
        // Get direct mapping if possible
        var directMappingName = instance[json_convert_options_1.Settings.CLASS_IDENTIFIER] + "." + propertyName;
        if (typeof (mappings[directMappingName]) !== "undefined") {
            return mappings[directMappingName];
        }
        // No mapping was found, try to find some
        var indirectMappingNames = Object.keys(mappings).filter(function (key) { return key.match("\\." + propertyName + "$"); }); // use endsWidth in later versions
        if (indirectMappingNames.length > 0) {
            return mappings[indirectMappingNames[0]];
        }
        return null;
    };
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
     * @throws throws an expection in case of failure
     */
    JsonConvert.prototype.verifyProperty = function (expectedJsonType, value, serialize) {
        // Map immediately if we don't care about the type
        if (expectedJsonType === any_1.Any || expectedJsonType === null || expectedJsonType === Object) {
            return value;
        }
        // Check if attempt and expected was 1-d
        if (expectedJsonType instanceof Array === false && value instanceof Array === false) {
            // Check the type
            if (typeof (expectedJsonType) !== "undefined" && expectedJsonType.prototype.hasOwnProperty(json_convert_options_1.Settings.CLASS_IDENTIFIER)) {
                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: Given value is null.");
                }
                if (serialize)
                    return this.serializeObject(value);
                else
                    return this.deserializeObject(value, expectedJsonType);
            }
            else if (expectedJsonType === any_1.Any || expectedJsonType === null || expectedJsonType === Object) {
                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: Given value is null.");
                }
                return value;
            }
            else if (expectedJsonType === String || expectedJsonType === Number || expectedJsonType === Boolean) {
                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode === json_convert_enums_1.ValueCheckingMode.ALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: Given value is null.");
                }
                // Check if the types match
                if ((expectedJsonType === String && typeof (value) === "string") ||
                    (expectedJsonType === Number && typeof (value) === "number") ||
                    (expectedJsonType === Boolean && typeof (value) === "boolean")) {
                    return value;
                }
                else {
                    if (this.ignorePrimitiveChecks)
                        return value;
                    throw new Error("\tReason: Given object does not match the expected primitive type.");
                }
            }
            else {
                throw new Error("\tReason: Expected type is unknown. There might be multiple reasons for this:\n" +
                    "\t- You are missing the decorator @JsonObject (for object mapping)\n" +
                    "\t- You are missing the decorator @JsonConverter (for custom mapping) before your class definition\n" +
                    "\t- Your given class is undefined in the decorator because of circular dependencies");
            }
        }
        // Check if attempt and expected was n-d
        if (expectedJsonType instanceof Array && value instanceof Array) {
            var array = [];
            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }
            // We obviously don't care about the type, so return the value as is
            if (expectedJsonType.length === 0) {
                return value;
            }
            // Loop through the data. Both type and value are at least of length 1
            var autofillType = expectedJsonType.length < value.length;
            for (var i = 0; i < value.length; i++) {
                if (autofillType && i >= expectedJsonType.length)
                    expectedJsonType[i] = expectedJsonType[i - 1];
                array[i] = this.verifyProperty(expectedJsonType[i], value[i], serialize);
            }
            return array;
        }
        // Check if attempt was 1-d and expected was n-d
        if (expectedJsonType instanceof Array && value instanceof Object) {
            var array = [];
            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }
            // We obviously don't care about the type, so return the json value as is
            if (expectedJsonType.length === 0) {
                return value;
            }
            // Loop through the data. Both type and value are at least of length 1
            var autofillType = expectedJsonType.length < Object.keys(value).length;
            var i = 0;
            for (var key in value) {
                if (autofillType && i >= expectedJsonType.length)
                    expectedJsonType[i] = expectedJsonType[i - 1];
                array[key] = this.verifyProperty(expectedJsonType[i], value[key]);
                i++;
            }
            return array;
        }
        // Check if attempt was 1-d and expected was n-d
        if (expectedJsonType instanceof Array) {
            if (value === null) {
                if (this.valueCheckingMode !== json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL)
                    return null;
                else
                    throw new Error("\tReason: Given value is null.");
            }
            throw new Error("\tReason: Expected type is array, but given value is non-array.");
        }
        // Check if attempt was n-d and expected as 1-d
        if (value instanceof Array) {
            throw new Error("\tReason: Given value is array, but expected a non-array type.");
        }
        // All other attempts are fatal
        throw new Error("\tReason: Mapping failed because of an unknown error.");
    };
    ///////////////////////////
    // JSON2TYPESCRIPT TYPES //
    ///////////////////////////
    /**
     * Returns a string representation of the expected json type.
     *
     * @param expectedJsonType the expected type given from the decorator
     *
     * @returns {string} the string representation
     */
    JsonConvert.prototype.getExpectedType = function (expectedJsonType) {
        var type = "";
        if (expectedJsonType instanceof Array) {
            type = "[";
            for (var i = 0; i < expectedJsonType.length; i++) {
                if (i > 0)
                    type += ",";
                type += this.getExpectedType(expectedJsonType[i]);
            }
            type += "]";
            return type;
        }
        else {
            if (expectedJsonType === any_1.Any || expectedJsonType === null || expectedJsonType === Object) {
                return "any";
            }
            else if (expectedJsonType === String || expectedJsonType === Boolean || expectedJsonType === Number) {
                return (new expectedJsonType()).constructor.name.toLowerCase();
            }
            else if (typeof expectedJsonType === 'function') {
                return (new expectedJsonType()).constructor.name;
            }
            else if (expectedJsonType === undefined) {
                return "undefined";
            }
            else {
                return "?????";
            }
        }
    };
    /**
     * Returns a string representation of the JSON value type.
     *
     * @param jsonValue the JSON value
     *
     * @returns {string} the string representation
     */
    JsonConvert.prototype.getJsonType = function (jsonValue) {
        if (jsonValue === null)
            return "null";
        var type = "";
        if (jsonValue instanceof Array) {
            type = "[";
            for (var i = 0; i < jsonValue.length; i++) {
                if (i > 0)
                    type += ",";
                type += this.getJsonType(jsonValue[i]);
            }
            type += "]";
            return type;
        }
        else {
            return typeof (jsonValue);
        }
    };
    /**
     * Returns a string representation of the true TypeScript type.
     *
     * @param trueValue the true value
     *
     * @returns {string} the string representation
     */
    JsonConvert.prototype.getTrueType = function (trueValue) {
        return typeof (trueValue);
    };
    return JsonConvert;
}());
exports.JsonConvert = JsonConvert;
//# sourceMappingURL=json-convert.js.map