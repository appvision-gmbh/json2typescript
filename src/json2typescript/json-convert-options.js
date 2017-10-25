"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Reflect = require('../../Reflect');
var MetadataTool = (function () {
    function MetadataTool(metadataKey) {
        this.metadataKey = metadataKey;
    }
    MetadataTool.prototype.get = function (target) {
        return Reflect.getMetadata(this.metadataKey, target);
    };
    MetadataTool.prototype.getOrFail = function (target) {
        var result = this.get(target);
        if (result == null) {
            throw new Error("MetadataTool.getOrFail: no data found for key (" + this.metadataKey + ")");
        }
        return result;
    };
    MetadataTool.prototype.getOrInit = function (target, defaultValue) {
        var result = this.get(target);
        if (result == null) {
            result = defaultValue();
            this.set(result, target);
        }
        return result;
    };
    MetadataTool.prototype.getOwnOrInit = function (target, defaultValue) {
        var result = this.getOwn(target);
        if (result == null) {
            result = defaultValue();
            this.set(result, target);
        }
        return result;
    };
    MetadataTool.prototype.getOwnOrInitFromAncestors = function (target, defaultValue) {
        var result = this.getOwn(target);
        if (result == null) {
            var ancestorValue = this.get(target);
            result = defaultValue(ancestorValue);
            this.set(result, target);
        }
        return result;
    };
    MetadataTool.prototype.getOwn = function (target) {
        return Reflect.getOwnMetadata(this.metadataKey, target);
    };
    MetadataTool.prototype.hasOwn = function (target) {
        return Reflect.hasOwnMetadata(this.metadataKey, target);
    };
    MetadataTool.prototype.set = function (value, target) {
        Reflect.defineMetadata(this.metadataKey, value, target);
    };
    return MetadataTool;
}());
exports.MetadataTool = MetadataTool;
var Settings;
(function (Settings) {
    Settings.mapping = new MetadataTool("__jsonconvert__mapping__");
    Settings.mapper = new MetadataTool("__jsonconvert__mapper__");
    Settings.propertyClass = new MetadataTool("__jsonconvert__property_class__");
    Settings.classProperties = new MetadataTool("__jsonconvert__class_properties__");
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