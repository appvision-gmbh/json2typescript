"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_convert_options_1 = require("./json-convert-options");
function JsonConverter(target) {
    target[json_convert_options_1.Settings.MAPPER_PROPERTY] = "";
}
exports.JsonConverter = JsonConverter;
function JsonObject(target) {
    target[json_convert_options_1.Settings.MAPPING_PROPERTY] = [];
}
exports.JsonObject = JsonObject;
function JsonProperty(jsonPropertyName, conversionOption, isOptional) {
    return function (target, classPropertyName) {
        if (typeof (target[json_convert_options_1.Settings.MAPPING_PROPERTY]) === "undefined") {
            target[json_convert_options_1.Settings.MAPPING_PROPERTY] = [];
        }
        if (typeof (jsonPropertyName) === "undefined") {
            jsonPropertyName = classPropertyName;
        }
        if (typeof (isOptional) === "undefined") {
            isOptional = false;
        }
        if (classPropertyName === "version") {
        }
        var jsonPropertyMappingOptions = new json_convert_options_1.MappingOptions();
        jsonPropertyMappingOptions.classPropertyName = classPropertyName;
        jsonPropertyMappingOptions.jsonPropertyName = jsonPropertyName;
        jsonPropertyMappingOptions.isOptional = isOptional ? isOptional : false;
        if (typeof (conversionOption) !== "undefined" && typeof (conversionOption[json_convert_options_1.Settings.MAPPER_PROPERTY]) !== "undefined") {
            jsonPropertyMappingOptions.customConverter = new conversionOption();
        }
        else {
            jsonPropertyMappingOptions.expectedJsonType = conversionOption;
        }
        target[json_convert_options_1.Settings.MAPPING_PROPERTY][classPropertyName] = jsonPropertyMappingOptions;
    };
}
exports.JsonProperty = JsonProperty;
