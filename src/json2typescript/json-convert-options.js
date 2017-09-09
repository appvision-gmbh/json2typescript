"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Internal constants.
 */
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
Settings.MAPPING_PROPERTY = "__jsonconvert__mapping__";
Settings.MAPPER_PROPERTY = "__jsonconvert__mapper__";
exports.Settings = Settings;
;
/**
 * Internal mapping options for a property.
 */
var MappingOptions = (function () {
    function MappingOptions() {
        this.classPropertyName = "";
        this.jsonPropertyName = "";
        this.expectedJsonType = undefined;
        this.isOptional = false;
        this.customConverter = null;
    }
    return MappingOptions;
}());
exports.MappingOptions = MappingOptions;
