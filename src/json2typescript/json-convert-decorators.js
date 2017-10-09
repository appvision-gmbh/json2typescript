"use strict";
var json_convert_options_1 = require("./json-convert-options");
var any_1 = require("./any");
function JsonConverter(target) {
    target[json_convert_options_1.Settings.MAPPER_PROPERTY] = "";
}
exports.JsonConverter = JsonConverter;
function JsonObject(target) {
    target[json_convert_options_1.Settings.MAPPING_PROPERTY] = [];
}
exports.JsonObject = JsonObject;
function JsonProperty() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i - 0] = arguments[_i];
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
        var className = target.constructor.name;
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
//# sourceMappingURL=/Users/andreas/Documents/Git/git.appvision.ch/unibasel/json2typescript/src/json2typescript/json-convert-decorators.js.map