"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_convert_options_1 = require("./json-convert-options");
var any_1 = require("./any");
function JsonConverter(target) {
    target[json_convert_options_1.Settings.MAPPER_PROPERTY] = "";
}
exports.JsonConverter = JsonConverter;
function JsonObject(name) {
    var decorator = function (target) {
        target[json_convert_options_1.Settings.MAPPING_PROPERTY] = [];
        target[json_convert_options_1.Settings.CLASS_NAME_PROPERTY] = name;
        var mapping = target.prototype[json_convert_options_1.Settings.MAPPING_PROPERTY];
        if (!mapping) {
            return;
        }
        var unmappedKeys = Object.keys(mapping)
            .filter(function (val) { return val.indexOf("[[UNMAPPED]].") === 0; });
        for (var _i = 0, unmappedKeys_1 = unmappedKeys; _i < unmappedKeys_1.length; _i++) {
            var key = unmappedKeys_1[_i];
            mapping[key.replace("[[UNMAPPED]]", name)] =
                mapping[key];
            delete mapping[key];
        }
        target.prototype[json_convert_options_1.Settings.MAPPING_PROPERTY] = mapping;
    };
    if (typeof name !== "string") {
        var target = name;
        name = name.name;
        decorator(target);
        return;
    }
    return decorator;
}
exports.JsonObject = JsonObject;
function JsonProperty() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    return function (target, classPropertyName) {
        var jsonPropertyName = classPropertyName;
        var conversionOption = any_1.Any;
        var isOptional = false;
        switch (params.length) {
            case 0:
                break;
            case 1:
                jsonPropertyName = params[0];
                break;
            case 2:
                if (params[1] === undefined)
                    throw new Error("Fatal error in JsonConvert. " +
                        "It's not allowed to explicitely pass \"undefined\" as second parameter in the @JsonProperty decorator.\n\n" +
                        "\tClass name: \n\t\t" + target.constructor.name + "\n\n" +
                        "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                        "Use \"Any\" to allow any type. You can import this class from \"json2typescript\".\n\n");
                jsonPropertyName = params[0];
                conversionOption = params[1];
                break;
            case 3:
                jsonPropertyName = params[0];
                conversionOption = params[1];
                isOptional = params[2];
                break;
            default:
                break;
        }
        if (typeof (target[json_convert_options_1.Settings.MAPPING_PROPERTY]) === "undefined") {
            target[json_convert_options_1.Settings.MAPPING_PROPERTY] = [];
        }
        var className = '[[UNMAPPED]]';
        if (typeof (jsonPropertyName) === "undefined") {
            jsonPropertyName = classPropertyName;
        }
        var jsonPropertyMappingOptions = new json_convert_options_1.MappingOptions();
        jsonPropertyMappingOptions.classPropertyName = classPropertyName;
        jsonPropertyMappingOptions.jsonPropertyName = jsonPropertyName;
        jsonPropertyMappingOptions.isOptional = isOptional ? isOptional : false;
        if (typeof (conversionOption) !== "undefined" && conversionOption !== null && typeof (conversionOption[json_convert_options_1.Settings.MAPPER_PROPERTY]) !== "undefined") {
            jsonPropertyMappingOptions.customConverter = new conversionOption();
        }
        else {
            jsonPropertyMappingOptions.expectedJsonType = conversionOption;
        }
        target[json_convert_options_1.Settings.MAPPING_PROPERTY][className + "." + classPropertyName] = jsonPropertyMappingOptions;
    };
}
exports.JsonProperty = JsonProperty;
//# sourceMappingURL=/home/zoltan.fodor/Documents/json2typescript/src/json2typescript/json-convert-decorators.js.map