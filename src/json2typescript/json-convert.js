"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonConvert = (function () {
    function JsonConvert() {
        this._operationMode = OperationMode.ENABLE;
        this._valueCheckingMode = ValueCheckingMode.ALLOW_OBJECT_NULL;
        this._ignorePrimitiveChecks = false;
    }
    Object.defineProperty(JsonConvert.prototype, "operationMode", {
        get: function () {
            return this._operationMode;
        },
        set: function (value) {
            if (value in OperationMode)
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
            if (value in ValueCheckingMode)
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
    JsonConvert.prototype.construct = function (operationMode, valueCheckingMode, ignorePrimitiveChecks) {
        if (operationMode in OperationMode)
            this.operationMode = operationMode;
        if (valueCheckingMode in ValueCheckingMode)
            this.valueCheckingMode = valueCheckingMode;
        if (ignorePrimitiveChecks)
            this.ignorePrimitiveChecks = ignorePrimitiveChecks;
    };
    JsonConvert.prototype.serializeObject = function (instance) {
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript object:");
            console.log(instance);
        }
        var jsonString = JSON.stringify(instance);
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning JSON string:");
            console.log(jsonString);
            console.log("----------");
        }
        return jsonString;
    };
    JsonConvert.prototype.deserialize = function (json, classObject) {
        if (typeof json === "string")
            return this.deserializeString(json, classObject);
        if (json.constructor === Array)
            return this.deserializeArray(json, classObject);
        if (typeof json === "object")
            return this.deserializeObject(json, classObject);
        throw new Error("Fatal error in JsonConvert. " +
            "Passed parameter json in JsonConvert.deserialize() is not a valid json format (string, object or array).");
    };
    ;
    JsonConvert.prototype.deserializeString = function (jsonString, classObject) {
        if (typeof (jsonString) !== "string") {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not of type string.");
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Receiving JSON string:");
            console.log(jsonString);
        }
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
    JsonConvert.prototype.deserializeObject = function (jsonObject, classObject) {
        if (typeof (jsonObject) !== "object" || jsonObject instanceof Array) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object.");
        }
        if (this.operationMode === OperationMode.DISABLE) {
            return jsonObject;
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }
        var classInstance = new classObject();
        for (var _i = 0, _a = Object.keys(classInstance); _i < _a.length; _i++) {
            var propertyKey = _a[_i];
            this.deserializeObject_loopProperty(classInstance, propertyKey, jsonObject);
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning CLASS instance:");
            console.log(classInstance);
        }
        return classInstance;
    };
    JsonConvert.prototype.deserializeArray = function (jsonArray, classObject) {
        if (typeof (jsonArray) !== "object" || jsonArray instanceof Array === false) {
            throw new Error("Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array.");
        }
        if (this.operationMode === OperationMode.DISABLE) {
            return jsonArray;
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }
        var array = [];
        for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
            var jsonObject = jsonArray_1[_i];
            array.push(this.deserializeObject(jsonObject, classObject));
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
        }
        return array;
    };
    JsonConvert.prototype.deserializeObject_loopProperty = function (classInstance, propertyKey, json) {
        var mapping = classInstance["__jsonconvert__mapping__"];
        if (this.deserializeObject_propertyHasDecorator(mapping, propertyKey) === false) {
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
    JsonConvert.prototype.deserializeObject_propertyHasDecorator = function (mapping, propertyKey) {
        return typeof (mapping) !== "undefined" && typeof (mapping[propertyKey]) !== "undefined";
    };
    JsonConvert.prototype.deserializeObject_mapProperty = function (expectedType, jsonValue) {
        if (typeof (expectedType) === "undefined" || expectedType === null || expectedType === Object) {
            return jsonValue;
        }
        if (expectedType instanceof Array === false && jsonValue instanceof Array === false) {
            if (expectedType.hasOwnProperty("__jsonconvert__mapping__")) {
                if (jsonValue === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                return this.deserializeObject(jsonValue, expectedType);
            }
            else if (expectedType === null || expectedType === Object || expectedType === undefined) {
                if (jsonValue === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else
                        throw new Error("\tReason: JSON value is null.");
                }
                return jsonValue;
            }
            else if (expectedType === String || expectedType === Number || expectedType === Boolean) {
                if (jsonValue === null) {
                    if (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL)
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
                    if (this.ignorePrimitiveChecks)
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
                array[i] = this.deserializeObject_mapProperty(expectedType[i], jsonValue[i]);
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
                array[key] = this.deserializeObject_mapProperty(expectedType[i], jsonValue[key]);
                i++;
            }
            return array;
        }
        if (expectedType instanceof Array) {
            if (jsonValue === null) {
                if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
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
var OperationMode;
(function (OperationMode) {
    OperationMode[OperationMode["DISABLE"] = 0] = "DISABLE";
    OperationMode[OperationMode["ENABLE"] = 1] = "ENABLE";
    OperationMode[OperationMode["LOGGING"] = 2] = "LOGGING";
})(OperationMode = exports.OperationMode || (exports.OperationMode = {}));
;
var ValueCheckingMode;
(function (ValueCheckingMode) {
    ValueCheckingMode[ValueCheckingMode["ALLOW_NULL"] = 1] = "ALLOW_NULL";
    ValueCheckingMode[ValueCheckingMode["ALLOW_OBJECT_NULL"] = 2] = "ALLOW_OBJECT_NULL";
    ValueCheckingMode[ValueCheckingMode["DISALLOW_NULL"] = 3] = "DISALLOW_NULL";
})(ValueCheckingMode = exports.ValueCheckingMode || (exports.ValueCheckingMode = {}));
;
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