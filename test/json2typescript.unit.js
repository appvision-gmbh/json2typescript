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
exports.__esModule = true;
var json_convert_1 = require("../src/json2typescript/json-convert");
var json_convert_enums_1 = require("../src/json2typescript/json-convert-enums");
var json_convert_decorators_1 = require("../src/json2typescript/json-convert-decorators");
var json_convert_options_1 = require("../src/json2typescript/json-convert-options");
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
            lastname: "Aeschlimann"
        };
        var cat1JsonObject = {
            name: "Meowy",
            district: 100,
            owner: human1JsonObject
        };
        var cat2JsonObject = {
            name: "Links",
            district: 50,
            owner: human1JsonObject
        };
        var dog1JsonObject = {
            name: "Barky",
            barking: true,
            owner: null
        };
        var animalJsonArray = [cat1JsonObject, dog1JsonObject];
        var catsJsonArray = [cat1JsonObject, cat2JsonObject];
        // TYPESCRIPT CLASSES
        var DateConverter = (function () {
            function DateConverter() {
            }
            DateConverter.prototype.serialize = function (date) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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
        ], Human.prototype, "firstname");
        __decorate([
            json_convert_decorators_1.JsonProperty("lastname", String)
        ], Human.prototype, "lastname");
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
        ], Animal.prototype, "name");
        __decorate([
            json_convert_decorators_1.JsonProperty("owner", Human, true)
        ], Animal.prototype, "owner");
        __decorate([
            json_convert_decorators_1.JsonProperty("birthdate", DateConverter)
        ], Animal.prototype, "birthdate");
        Animal = __decorate([
            json_convert_decorators_1.JsonObject
        ], Animal);
        var Cat = (function (_super) {
            __extends(Cat, _super);
            function Cat() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.district = undefined;
                return _this;
            }
            return Cat;
        }(Animal));
        __decorate([
            json_convert_decorators_1.JsonProperty("district", Number)
        ], Cat.prototype, "district");
        Cat = __decorate([
            json_convert_decorators_1.JsonObject
        ], Cat);
        var Dog = (function (_super) {
            __extends(Dog, _super);
            function Dog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isBarking = undefined;
                return _this;
            }
            return Dog;
        }(Animal));
        __decorate([
            json_convert_decorators_1.JsonProperty("barking", Boolean)
        ], Dog.prototype, "isBarking");
        Dog = __decorate([
            json_convert_decorators_1.JsonObject
        ], Dog);
        // TYPESCRIPT INSTANCES
        var human1 = new Human();
        human1.firstname = "Andreas";
        human1.lastname = "Aeschlimann";
        var cat1 = new Cat();
        cat1.name = "Meowy";
        cat1.district = 100;
        cat1.owner = human1;
        var cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.owner = human1;
        var dog1 = new Dog();
        dog1.name = "Barky";
        dog1.isBarking = true;
        dog1.owner = null;
        var animals = [cat1, dog1];
        var cats = [cat1, cat2];
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
                        lastname: "Aeschlimann"
                    }
                });
                expect(t_cat.owner.firstname).toEqual("Andreas");
            });
        });
        // HELPER METHODS
        describe('helper methods', function () {
            it('classPropertyHasDecorator()', function () {
                expect(jsonConvert.classPropertyHasDecorator(cat1[json_convert_options_1.Settings.MAPPING_PROPERTY], "name")).toBe(true);
                expect(jsonConvert.classPropertyHasDecorator(dog1[json_convert_options_1.Settings.MAPPING_PROPERTY], "name")).toBe(true);
                expect(jsonConvert.classPropertyHasDecorator(human1[json_convert_options_1.Settings.MAPPING_PROPERTY], "name")).toBe(false);
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
                expect(jsonConvert.getExpectedType([[null, undefined], Object])).toBe("[[any,any],any]");
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
