"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_convert_1 = require("../src/json2typescript/json-convert");
var json_convert_enums_1 = require("../src/json2typescript/json-convert-enums");
var json_convert_decorators_1 = require("../src/json2typescript/json-convert-decorators");
var any_1 = require("../src/json2typescript/any");
describe('Unit tests', function () {
    describe('JsonConvert', function () {
        // JSONCONVERT INSTANCE
        var jsonConvert = new json_convert_1.JsonConvert();
        jsonConvert.operationMode = json_convert_enums_1.OperationMode.ENABLE;
        jsonConvert.valueCheckingMode = json_convert_enums_1.ValueCheckingMode.ALLOW_NULL;
        jsonConvert.ignorePrimitiveChecks = false;
        // JSON DATA
        var human1JsonObject = {
            firstname: "Andreas",
            lastname: "Muster"
        };
        var cat1JsonObject = {
            name: "Meowy",
            district: 100,
            owner: human1JsonObject,
            talky: true,
            other: "cute"
        };
        var cat2JsonObject = {
            name: "Links",
            district: 50,
            owner: human1JsonObject,
            talky: true,
            other: "sweet"
        };
        var dog1JsonObject = {
            name: "Barky",
            barking: true,
            owner: null,
            other: 1.1
        };
        var animalJsonArray = [cat1JsonObject, dog1JsonObject];
        var catsJsonArray = [cat1JsonObject, cat2JsonObject];
        // TYPESCRIPT CLASSES
        var DateConverter = (function () {
            function DateConverter() {
            }
            DateConverter.prototype.serialize = function (date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
            };
            DateConverter.prototype.deserialize = function (date) {
                return new Date(date);
            };
            return DateConverter;
        }());
        DateConverter = __decorate([
            json_convert_decorators_1.JsonConverter
        ], DateConverter);
        var Human = (function () {
            function Human() {
                this.firstname = "";
                this.lastname = "";
            }
            Human.prototype.getName = function () {
                return this.firstname + " " + this.lastname;
            };
            return Human;
        }());
        __decorate([
            json_convert_decorators_1.JsonProperty("firstname", String)
        ], Human.prototype, "firstname", void 0);
        __decorate([
            json_convert_decorators_1.JsonProperty("lastname", String)
        ], Human.prototype, "lastname", void 0);
        Human = __decorate([
            json_convert_decorators_1.JsonObject
        ], Human);
        var Animal = (function () {
            function Animal() {
                this.name = undefined;
                this.owner = undefined;
            }
            return Animal;
        }());
        __decorate([
            json_convert_decorators_1.JsonProperty("name", String)
        ], Animal.prototype, "name", void 0);
        __decorate([
            json_convert_decorators_1.JsonProperty("owner", Human, true)
        ], Animal.prototype, "owner", void 0);
        __decorate([
            json_convert_decorators_1.JsonProperty("birthdate", DateConverter)
        ], Animal.prototype, "birthdate", void 0);
        Animal = __decorate([
            json_convert_decorators_1.JsonObject
        ], Animal);
        var Cat = (function (_super) {
            __extends(Cat, _super);
            function Cat() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.district = undefined;
                _this.talky = undefined;
                _this.other = undefined;
                return _this;
            }
            return Cat;
        }(Animal));
        __decorate([
            json_convert_decorators_1.JsonProperty()
        ], Cat.prototype, "district", void 0);
        __decorate([
            json_convert_decorators_1.JsonProperty()
        ], Cat.prototype, "talky", void 0);
        __decorate([
            json_convert_decorators_1.JsonProperty("other", String)
        ], Cat.prototype, "other", void 0);
        Cat = __decorate([
            json_convert_decorators_1.JsonObject
        ], Cat);
        var Dog = (function (_super) {
            __extends(Dog, _super);
            function Dog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isBarking = undefined;
                _this.other = undefined;
                return _this;
            }
            return Dog;
        }(Animal));
        __decorate([
            json_convert_decorators_1.JsonProperty("barking", Boolean)
        ], Dog.prototype, "isBarking", void 0);
        __decorate([
            json_convert_decorators_1.JsonProperty("other", Number)
        ], Dog.prototype, "other", void 0);
        Dog = __decorate([
            json_convert_decorators_1.JsonObject
        ], Dog);
        // TYPESCRIPT INSTANCES
        var human1 = new Human();
        human1.firstname = "Andreas";
        human1.lastname = "Muster";
        var cat1 = new Cat();
        cat1.name = "Meowy";
        cat1.district = 100;
        cat1.owner = human1;
        cat1.talky = true;
        cat1.other = "cute";
        var cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.owner = human1;
        cat2.other = "sweet";
        var dog1 = new Dog();
        dog1.name = "Barky";
        dog1.isBarking = true;
        dog1.owner = null;
        dog1.other = 1.1;
        var animals = [cat1, dog1];
        var cats = [cat1, cat2];
        // BASIC CHECKS
        describe('basic checks', function () {
            it('serialize and deserialize same data', function () {
                var t_catJsonObject = jsonConvert.serialize(cat1);
                expect(t_catJsonObject).toEqual(cat1JsonObject);
                var t_cat = jsonConvert.deserialize(t_catJsonObject, Cat);
                expect(t_cat).toEqual(cat1);
            });
            it('deserialize and serialize same data', function () {
                var t_cat = jsonConvert.deserialize(cat1JsonObject, Cat);
                expect(t_cat).toEqual(cat1);
                var t_catJsonObject = jsonConvert.serialize(t_cat);
                expect(t_catJsonObject).toEqual(cat1JsonObject);
            });
        });
        // PRIVATE METHODS
        describe('private methods', function () {
            it('serializeObject_loopProperty()', function () {
                var t_cat = {};
                jsonConvert.serializeObject_loopProperty(cat1, "name", t_cat);
                expect(t_cat["name"]).toBe(cat1.name);
                jsonConvert.serializeObject_loopProperty(cat1, "district", t_cat);
                expect(t_cat["district"]).toBe(100);
                jsonConvert.serializeObject_loopProperty(cat1, "owner", t_cat);
                expect(t_cat["owner"]["firstname"]).toBe("Andreas");
            });
            it('deserializeObject_loopProperty()', function () {
                var t_cat = new Cat();
                jsonConvert.deserializeObject_loopProperty(t_cat, "name", { "name": "Meowy" });
                expect(t_cat.name).toEqual("Meowy");
                jsonConvert.deserializeObject_loopProperty(t_cat, "district", { "district": 100 });
                expect(t_cat.district).toEqual(100);
                jsonConvert.deserializeObject_loopProperty(t_cat, "owner", {
                    "owner": {
                        firstname: "Andreas",
                        lastname: "Muster"
                    }
                });
                expect(t_cat.owner.firstname).toEqual("Andreas");
            });
        });
        // HELPER METHODS
        describe('helper methods', function () {
            it('getClassPropertyMappingOptions()', function () {
                expect(jsonConvert.getClassPropertyMappingOptions(cat1, "name")).not.toBeNull();
                expect(jsonConvert.getClassPropertyMappingOptions(dog1, "name")).not.toBeNull();
                expect(jsonConvert.getClassPropertyMappingOptions(human1, "name")).toBeNull();
            });
            it('verifyProperty()', function () {
                expect(jsonConvert.verifyProperty(String, "Andreas", false)).toBe("Andreas");
                //expect((<any>jsonConvert).verifyProperty(Number, "Andreas", false)).toThrow(undefined);
                expect(jsonConvert.verifyProperty([String, [Boolean, Number]], ["Andreas", [true, 2.2]], false)).toEqual(["Andreas", [true, 2.2]]);
            });
        });
        // JSON2TYPESCRIPT TYPES
        describe('json2typescript types', function () {
            it('getExpectedType()', function () {
                expect(jsonConvert.getExpectedType(json_convert_1.JsonConvert)).toBe("JsonConvert");
                expect(jsonConvert.getExpectedType([String, [Boolean, Number]])).toBe("[string,[boolean,number]]");
                expect(jsonConvert.getExpectedType([[null, any_1.Any], Object])).toBe("[[any,any],any]");
            });
            it('getJsonType()', function () {
                expect(jsonConvert.getJsonType({ name: "Andreas" })).toBe("object");
                expect(jsonConvert.getJsonType(["a", 0, [true, null]])).toBe("[string,number,[boolean,null]]");
            });
            it('getTrueType()', function () {
                expect(jsonConvert.getTrueType(new json_convert_1.JsonConvert())).toBe("object");
                expect(jsonConvert.getTrueType({ name: "Andreas" })).toBe("object");
                expect(jsonConvert.getTrueType("Andreas")).toBe("string");
            });
        });
    });
});
