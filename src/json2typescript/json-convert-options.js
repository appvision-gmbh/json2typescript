"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Internal constants.
 */
var Settings = /** @class */ (function () {
    function Settings() {
    }
    Settings.MAPPING_PROPERTY = "__jsonconvert__mapping__";
    Settings.MAPPER_PROPERTY = "__jsonconvert__mapper__";
    Settings.CLASS_IDENTIFIER = "__jsonconvert__class_identifier__";
    return Settings;
}());
exports.Settings = Settings;
;
/**
 * Internal mapping options for a property.
 */
var MappingOptions = /** @class */ (function () {
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
//# sourceMappingURL=json-convert-options.js.map