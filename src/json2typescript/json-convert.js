"use strict";
var json_convert_enums_1 = require("./json-convert-enums");
var json_convert_options_1 = require("./json-convert-options");
var any_1 = require("./any");
var JsonConvert = (function () {
    function JsonConvert(operationMode, valueCheckingMode, ignorePrimitiveChecks) {
        this._operationMode = json_convert_enums_1.OperationMode.ENABLE;
        this._valueCheckingMode = json_convert_enums_1.ValueCheckingMode.ALLOW_OBJECT_NULL;
        this._ignorePrimitiveChecks = false;
        if (operationMode && operationMode in json_convert_enums_1.OperationMode)
            this.operationMode = operationMode;
        if (valueCheckingMode && valueCheckingMode in json_convert_enums_1.ValueCheckingMode)
            this.valueCheckingMode = valueCheckingMode;
        if (ignorePrimitiveChecks)
            this.ignorePrimitiveChecks = ignorePrimitiveChecks;
    }
    Object.defineProperty(JsonConvert.prototype, "operationMode", {
        get: function () {
            return this._operationMode;
        },
        set: function (value) {
            if (value in json_convert_enums_1.OperationMode)
                this._operationMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonConvert.prototype, "valueCheckingMode", {
        get: function () {
            return this._valueCheckingMode;
        },
        set: function (value) {
            if (value in json_convert_enums_1.ValueCheckingMode)
                this._valueCheckingMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonConvert.prototype, "ignorePrimitiveChecks", {
        get: function () {
            return this._ignorePrimitiveChecks;
        },
        set: function (value) {
            this._ignorePrimitiveChecks = value;
        },
        enumerable: true,
        configurable: true
    });
    JsonConvert.prototype.serialize = function (data) {
        if (data.constructor === Array)
            return this.serializeArray(data);
        if (typeof data === "object")
            return this.serializeObject(data);
        throw new Error("Fatal error in JsonConvert. " +
            "Passed parameter json in JsonConvert.serialize() is not in valid format (object or array).");
    };
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
    JsonConvert.prototype.deserialize = function (json, classReference) {
        if (json.constructor === Array)
            return this.deserializeArray(json, classReference);
        if (typeof json === "object")
            return this.deserializeObject(json, classReference);
        throw new Error("Fatal error in JsonConvert. " +
            "Passed parameter json in JsonConvert.deserialize() is not in valid JSON format (object or array).");
    };
    ;
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
    JsonConvert.prototype.serializeObject_loopProperty = function (instance, classPropertyName, json) {
        var mappingOptions = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }
        var jsonKey = mappingOptions.jsonPropertyName;
        var expectedJsonType = mappingOptions.expectedJsonType;
        var isOptional = mappingOptions.isOptional;
        var customConverter = mappingOptions.customConverter;
        var classInstancePropertyValue = instance[classPropertyName];
        if (typeof (classInstancePropertyValue) === "undefined") {
            if (isOptional)
                return;
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance.constructor["name"] + "\" to JSON because the defined class property \"" + classPropertyName + "\" does not exist or is not defined:\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n");
        }
        try {
            json[jsonKey] = customConverter !== null ? customConverter.serialize(classInstancePropertyValue) : this.verifyProperty(expectedJsonType, classInstancePropertyValue, true);
        }
        catch (e) {
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance.constructor["name"] + "\" to JSON because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tClass property value: \n\t\t" + classInstancePropertyValue + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tRuntime type: \n\t\t" + this.getTrueType(classInstancePropertyValue) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                e.message + "\n");
        }
    };
    JsonConvert.prototype.deserializeObject_loopProperty = function (instance, classPropertyName, json) {
        var mappingOptions = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }
        var jsonKey = mappingOptions.jsonPropertyName;
        var expectedJsonType = mappingOptions.expectedJsonType;
        var isOptional = mappingOptions.isOptional;
        var customConverter = mappingOptions.customConverter;
        var jsonValue = json[jsonKey];
        if (typeof (jsonValue) === "undefined") {
            if (isOptional)
                return;
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + instance.constructor["name"] + "\" because the defined JSON property \"" + jsonKey + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n");
        }
        try {
            instance[classPropertyName] = customConverter !== null ? customConverter.deserialize(jsonValue) : this.verifyProperty(expectedJsonType, jsonValue);
        }
        catch (e) {
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the JavaScript class \"" + instance.constructor["name"] + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                "\tJSON type: \n\t\t" + this.getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message + "\n\n");
        }
    };
    JsonConvert.prototype.getClassPropertyMappingOptions = function (instance, propertyName) {
        var mappings = instance[json_convert_options_1.Settings.MAPPING_PROPERTY];
        if (typeof (mappings) === "undefined")
            return null;
        var directMappingName = instance.constructor.name + "." + propertyName;
        if (typeof (mappings[directMappingName]) !== "undefined") {
            return mappings[directMappingName];
        }
        var indirectMappingNames = Object.keys(mappings).filter(function (key) { return key.match("\\." + propertyName + "$"); });
        if (indirectMappingNames.length > 0) {
            return mappings[indirectMappingNames[0]];
        }
        return null;
    };
    JsonConvert.prototype.verifyProperty = function (expectedJsonType, value, serialize) {
        if (expectedJsonType === any_1.Any || expectedJsonType === null || expectedJsonType === Object) {
            return value;
        }
        if (expectedJsonType instanceof Array === false && value instanceof Array === false) {
            if (typeof (expectedJsonType) !== "undefined" && expectedJsonType.hasOwnProperty(json_convert_options_1.Settings.MAPPING_PROPERTY)) {
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
                if (value === null) {
                    if (this.valueCheckingMode !== json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: Given value is null.");
                }
                return value;
            }
            else if (expectedJsonType === String || expectedJsonType === Number || expectedJsonType === Boolean) {
                if (value === null) {
                    if (this.valueCheckingMode === json_convert_enums_1.ValueCheckingMode.ALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: Given value is null.");
                }
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
                throw new Error("\tReason: Expected type is unknown. There might be multiple reasons for this:\n\t- You are missing the decorator @JsonObject (for object mapping)\n\t- You are missing the decorator @JsonConverter (for custom mapping) before your class definition\n\t- Your given class is undefined in the decorator because of circular dependencies");
            }
        }
        if (expectedJsonType instanceof Array && value instanceof Array) {
            var array = [];
            if (value.length === 0) {
                return array;
            }
            if (expectedJsonType.length === 0) {
                return value;
            }
            var autofillType = expectedJsonType.length < value.length;
            for (var i = 0; i < value.length; i++) {
                if (autofillType && i >= expectedJsonType.length)
                    expectedJsonType[i] = expectedJsonType[i - 1];
                array[i] = this.verifyProperty(expectedJsonType[i], value[i], serialize);
            }
            return array;
        }
        if (expectedJsonType instanceof Array && value instanceof Object) {
            var array = [];
            if (value.length === 0) {
                return array;
            }
            if (expectedJsonType.length === 0) {
                return value;
            }
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
        if (expectedJsonType instanceof Array) {
            if (value === null) {
                if (this.valueCheckingMode !== json_convert_enums_1.ValueCheckingMode.DISALLOW_NULL)
                    return null;
                else
                    throw new Error("\tReason: Given value is null.");
            }
            throw new Error("\tReason: Expected type is array, but given value is non-array.");
        }
        if (value instanceof Array) {
            throw new Error("\tReason: Given value is array, but expected a non-array type.");
        }
        throw new Error("\tReason: Mapping failed because of an unknown error.");
    };
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
            else if (expectedJsonType === String || expectedJsonType == Boolean || expectedJsonType == Number) {
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
    JsonConvert.prototype.getTrueType = function (trueValue) {
        return typeof (trueValue);
    };
    return JsonConvert;
}());
exports.JsonConvert = JsonConvert;
//# sourceMappingURL=/Users/andreas/Documents/Git/git.appvision.ch/unibasel/json2typescript/src/json2typescript/json-convert.js.map