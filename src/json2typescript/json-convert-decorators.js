"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_convert_options_1 = require("./json-convert-options");
var any_1 = require("./any");
function JsonConverter(target) {
    json_convert_options_1.Settings.mapper.set("", target);
}
exports.JsonConverter = JsonConverter;
function JsonObject(target) {
    json_convert_options_1.Settings.mapping.set([], target);
}
exports.JsonObject = JsonObject;
function JsonProperty() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var overrideJsonPropertyName = null;
    var conversionOption = any_1.Any;
    var isOptional = false;
    var isError = false;
    switch (params.length) {
        case 0:
            break;
        case 1:
            overrideJsonPropertyName = params[0];
            break;
        case 2:
            if (params[1] === undefined) {
                isError = true;
                break;
            }
            overrideJsonPropertyName = params[0];
            conversionOption = params[1];
            break;
        case 3:
            overrideJsonPropertyName = params[0];
            conversionOption = params[1];
            isOptional = params[2];
            break;
        default:
            break;
    }
    return function (target, classPropertyName, descriptor) {
        if (isError) {
            throw new Error("Fatal error in JsonConvert. " +
                "It's not allowed to explicitely pass \"undefined\" as second parameter in the @JsonProperty decorator.\n\n" +
                "\tClass name: \n\t\t" + target.constructor.name + "\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "Use \"Any\" to allow any type. You can import this class from \"json2typescript\".\n\n");
        }
        var jsonPropertyName = classPropertyName;
        if (overrideJsonPropertyName != null) {
            jsonPropertyName = overrideJsonPropertyName;
        }
        var className = target.constructor.name;
        if (typeof (jsonPropertyName) === "undefined") {
            jsonPropertyName = classPropertyName;
        }
        var jsonPropertyMappingOptions = new json_convert_options_1.MappingOptions();
        jsonPropertyMappingOptions.classPropertyName = classPropertyName;
        jsonPropertyMappingOptions.jsonPropertyName = jsonPropertyName;
        jsonPropertyMappingOptions.isOptional = isOptional ? isOptional : false;
        if (typeof (conversionOption) !== "undefined" && conversionOption !== null && typeof (json_convert_options_1.Settings.mapper.get(conversionOption)) !== "undefined") {
            jsonPropertyMappingOptions.customConverter = new conversionOption();
        }
        else {
            jsonPropertyMappingOptions.expectedJsonType = conversionOption;
        }
        var mapping = json_convert_options_1.Settings.mapping.getOwnOrInitFromAncestors(target, function (a) { return (__assign({}, a)); });
        mapping[className + "." + classPropertyName] = jsonPropertyMappingOptions;
        json_convert_options_1.Settings.classProperties.getOwnOrInitFromAncestors(target, function (a) { return (a || []).slice(); }).push(classPropertyName);
    };
}
exports.JsonProperty = JsonProperty;
//# sourceMappingURL=D:/files/work/mc/prime/www/json2typescript/json2typescript/json-convert-decorators.js.map