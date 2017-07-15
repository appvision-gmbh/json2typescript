"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueCheckingMode;
(function (ValueCheckingMode) {
    ValueCheckingMode[ValueCheckingMode["ALLOW_NULL"] = 1] = "ALLOW_NULL";
    ValueCheckingMode[ValueCheckingMode["ALLOW_OBECT_NULL"] = 2] = "ALLOW_OBECT_NULL";
    ValueCheckingMode[ValueCheckingMode["DISALLOW_NULL"] = 3] = "DISALLOW_NULL";
})(ValueCheckingMode = exports.ValueCheckingMode || (exports.ValueCheckingMode = {}));
var JsonConvert = (function () {
    function JsonConvert() {
    }
    JsonConvert.serializeObject = function (instance) {
        if (JsonConvert.debugMode) {
            console.log("----------");
            console.log("Receiving JavaScript object:");
            console.log(instance);
        }
        var jsonString = JSON.stringify(instance);
        if (JsonConvert.debugMode) {
            console.log("Returning JSON string:");
            console.log(jsonString);
            console.log("----------");
        }
        return jsonString;
    };
    JsonConvert.deserializeString = function (jsonString, classObject) {
        if (typeof (jsonString) !== "string") {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not of type string.");
        }
        if (JsonConvert.debugMode) {
            console.log("Receiving JSON string:");
            console.log(jsonString);
        }
        var jsonData = JSON.parse(jsonString);
        if (typeof (jsonData) === 'object') {
            if (jsonData instanceof Array) {
                return JsonConvert.deserializeArray(jsonData, classObject);
            }
            else {
                return JsonConvert.deserializeObject(jsonData, classObject);
            }
        }
        else {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not a valid json string.");
        }
    };
    JsonConvert.deserializeObject = function (jsonObject, classObject) {
        if (typeof (jsonObject) !== "object" || jsonObject instanceof Array) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object.");
        }
        if (JsonConvert.debugMode) {
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }
        var classInstance = new classObject();
        for (var _i = 0, _a = Object.keys(classInstance); _i < _a.length; _i++) {
            var propertyKey = _a[_i];
            JsonConvert.deserializeObject_loopProperty(classInstance, propertyKey, jsonObject);
        }
        if (JsonConvert.debugMode) {
            console.log("Returning CLASS instance:");
            console.log(classInstance);
        }
        return classInstance;
    };
    JsonConvert.deserializeArray = function (jsonArray, classObject) {
        if (typeof (jsonArray) !== "object" || jsonArray instanceof Array === false) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array.");
        }
        if (JsonConvert.debugMode) {
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }
        var array = [];
        for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
            var jsonObject = jsonArray_1[_i];
            array.push(JsonConvert.deserializeObject(jsonObject, classObject));
        }
        if (JsonConvert.debugMode) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
        }
        return array;
    };
    JsonConvert.deserializeObject_loopProperty = function (classInstance, propertyKey, json) {
        var mapping = classInstance["__jsonconvert__mapping__"];
        if (JsonConvert.deserializeObject_propertyHasDecorator(mapping, propertyKey) === false) {
            if (typeof (json[propertyKey]) !== "undefined")
                classInstance[propertyKey] = json[propertyKey];
            return;
        }
        var jsonKey = mapping[propertyKey]["jsonKey"];
        var expectedType = mapping[propertyKey]["type"];
        var isOptional = mapping[propertyKey]["optional"];
        var jsonValue = json[jsonKey];
        if (typeof (jsonValue) === "undefined") {
            if (isOptional)
                return;
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + classInstance.constructor.name + "\" because the defined JSON property \"" + jsonKey + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey);
        }
        try {
            classInstance[propertyKey] = JsonConvert.deserializeObject_mapProperty(expectedType, jsonValue);
        }
        catch (e) {
            throw new Error("Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + classInstance.constructor.name + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tExpected type: \n\t\t" + JsonConvert.deserializeObject_getExpectedType(expectedType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                "\tJSON type: \n\t\t" + JsonConvert.deserializeObject_getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message + "\n");
        }
    };
    JsonConvert.deserializeObject_propertyHasDecorator = function (mapping, propertyKey) {
        return typeof (mapping) !== "undefined" && typeof (mapping[propertyKey]) !== "undefined";
    };
    JsonConvert.deserializeObject_mapProperty = function (expectedType, jsonValue) {
        if (typeof (expectedType) === "undefined" || expectedType === null || expectedType === Object) {
            return jsonValue;
        }
        if (expectedType instanceof Array === false && jsonValue instanceof Array === false) {
            if (expectedType.hasOwnProperty("__jsonconvert__mapping__")) {
                if (jsonValue === null) {
                    if (JsonConvert.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                return JsonConvert.deserializeObject(jsonValue, expectedType);
            }
            else if (expectedType === null || expectedType === Object || expectedType === undefined) {
                if (jsonValue === null) {
                    if (JsonConvert.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                return jsonValue;
            }
            else if (expectedType === String || expectedType === Number || expectedType === Boolean) {
                if (jsonValue === null) {
                    if (JsonConvert.valueCheckingMode === ValueCheckingMode.ALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                if ((expectedType === String && typeof (jsonValue) === "string") ||
                    (expectedType === Number && typeof (jsonValue) === "number") ||
                    (expectedType === Boolean && typeof (jsonValue) === "boolean")) {
                    return jsonValue;
                }
                else {
                    if (JsonConvert.ignorePrimitiveChecks)
                        return jsonValue;
                    throw new Error("\tReason: JSON object does not match the expected primitive type.");
                }
            }
            else {
                throw new Error("\tReason: Expected type is unknown.");
            }
        }
        if (expectedType instanceof Array && jsonValue instanceof Array) {
            var array = [];
            if (jsonValue.length === 0) {
                return array;
            }
            if (expectedType.length === 0) {
                return jsonValue;
            }
            var autofillType = expectedType.length < jsonValue.length;
            for (var i = 0; i < jsonValue.length; i++) {
                if (autofillType && i >= expectedType.length)
                    expectedType[i] = expectedType[i - 1];
                array[i] = JsonConvert.deserializeObject_mapProperty(expectedType[i], jsonValue[i]);
            }
            return array;
        }
        if (expectedType instanceof Array && jsonValue instanceof Object) {
            var array = [];
            if (jsonValue.length === 0) {
                return array;
            }
            if (expectedType.length === 0) {
                return jsonValue;
            }
            var autofillType = expectedType.length < Object.keys(jsonValue).length;
            var i = 0;
            for (var key in jsonValue) {
                if (autofillType && i >= expectedType.length)
                    expectedType[i] = expectedType[i - 1];
                array[key] = JsonConvert.deserializeObject_mapProperty(expectedType[i], jsonValue[key]);
                i++;
            }
            return array;
        }
        if (expectedType instanceof Array) {
            if (jsonValue === null) {
                if (JsonConvert.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                    return null;
                else
                    throw new Error("\tReason: JSON value is null.");
            }
            throw new Error("\tReason: Expected type is array, but JSON value is non-array.");
        }
        if (jsonValue instanceof Array) {
            throw new Error("\tReason: JSON value is array, but expected a non-array type.");
        }
        throw new Error("\tReason: Mapping failed because of an unknown error.");
    };
    JsonConvert.deserializeObject_getExpectedType = function (expectedType) {
        var type = "";
        if (expectedType instanceof Array) {
            type = "[";
            for (var i = 0; i < expectedType.length; i++) {
                if (i > 0)
                    type += ",";
                type += JsonConvert.deserializeObject_getExpectedType(expectedType[i]);
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
    JsonConvert.deserializeObject_getJsonType = function (jsonValue) {
        if (jsonValue === null)
            return "null";
        var type = "";
        if (jsonValue instanceof Array) {
            type = "[";
            for (var i = 0; i < jsonValue.length; i++) {
                if (i > 0)
                    type += ",";
                type += JsonConvert.deserializeObject_getJsonType(jsonValue[i]);
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
JsonConvert.debugMode = false;
JsonConvert.ignorePrimitiveChecks = false;
JsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_OBECT_NULL;
exports.JsonConvert = JsonConvert;
function JsonObject(target) {
    target["__jsonconvert__mapping__"] = [];
}
exports.JsonObject = JsonObject;
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
//# sourceMappingURL=C:/Users/andreas/GIT/appvision@git.appvision.ch/unibasel/json2typescript/src/json2typescript/json-convert.js.map