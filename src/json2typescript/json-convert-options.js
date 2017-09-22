"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Settings = (function () {
    function Settings() {
    }
    Settings.MAPPING_PROPERTY = "__jsonconvert__mapping__";
    Settings.MAPPER_PROPERTY = "__jsonconvert__mapper__";
    return Settings;
}());
exports.Settings = Settings;
;
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
//# sourceMappingURL=C:/git/github/kirakishin/json2typescript/src/json2typescript/json-convert-options.js.map