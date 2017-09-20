"use strict";
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
        if (typeof (json_convert_options_1.Settings.mapping.get(target)) === "undefined") {
            json_convert_options_1.Settings.mapping.set([], target);
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
        json_convert_options_1.Settings.mapping.get(target)[className + "." + classPropertyName] = jsonPropertyMappingOptions;
    };
}
exports.JsonProperty = JsonProperty;
//# sourceMappingURL=D:/files/work/mc/prime/www/json2typescript/json2typescript/json-convert-decorators.js.map