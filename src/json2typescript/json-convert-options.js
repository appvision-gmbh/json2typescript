"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var MetadataTool = (function () {
    function MetadataTool(metadataKey) {
        this.metadataKey = metadataKey;
    }
    MetadataTool.prototype.get = function (target) {
        return Reflect.getMetadata(this.metadataKey, target);
    };
    MetadataTool.prototype.getOwn = function (target) {
        return Reflect.getOwnMetadata(this.metadataKey, target);
    };
    MetadataTool.prototype.hasOwn = function (target) {
        return Reflect.hasOwnMetadata(this.metadataKey, target);
    };
    MetadataTool.prototype.set = function (value, target) {
        return Reflect.defineMetadata(this.metadataKey, value, target);
    };
    return MetadataTool;
}());
exports.MetadataTool = MetadataTool;
var Settings;
(function (Settings) {
    Settings.mapping = new MetadataTool("__jsonconvert__mapping__");
    Settings.mapper = new MetadataTool("__jsonconvert__mapper__");
    Settings.propertyClass = new MetadataTool("__jsonconvert__property_class__");
})(Settings = exports.Settings || (exports.Settings = {}));
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
//# sourceMappingURL=D:/files/work/mc/prime/www/json2typescript/json2typescript/json-convert-options.js.map