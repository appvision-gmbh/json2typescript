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
var json_convert_decorators_1 = require("../src/json2typescript/json-convert-decorators");
var json_convert_enums_1 = require("../src/json2typescript/json-convert-enums");
var any_1 = require("../src/json2typescript/any");
describe('Integration tests', function () {
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
            birthdate: "2016-01-02",
            friends: []
        };
        var dog1JsonObject = {
            name: "Barky",
            barking: true,
            owner: null,
            birthdate: "2016-01-02",
            friends: []
        };
        var cat2JsonObject = {
            name: "Links",
            district: 50,
            owner: human1JsonObject,
            birthdate: "2016-01-02",
            friends: [cat1JsonObject, dog1JsonObject]
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
            Human.prototype.getName = function () { return this.firstname + " " + this.lastname; };
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
                this.birthdate = undefined;
                this.friends = [];
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
        __decorate([
            json_convert_decorators_1.JsonProperty("friends", [any_1.Any], true)
        ], Animal.prototype, "friends", void 0);
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
        ], Cat.prototype, "district", void 0);
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
        ], Dog.prototype, "isBarking", void 0);
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
        cat1.birthdate = new Date("2016-01-02");
        var dog1 = new Dog();
        dog1.name = "Barky";
        dog1.isBarking = true;
        dog1.owner = null;
        dog1.birthdate = new Date("2016-01-02");
        var cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.owner = human1;
        cat2.birthdate = new Date("2016-01-02");
        cat2.friends = [cat1JsonObject, dog1JsonObject];
        var animals = [cat1, dog1];
        var cats = [cat1, cat2];
        // SERIALIZE INTEGRATION
        describe('serialize', function () {
            it('should serialize a TypeScript object to a JSON object', function () {
                expect(jsonConvert.serialize(cat1)).toEqual(cat1JsonObject);
            });
            it('should serialize a TypeScript array to a JSON array', function () {
                expect(jsonConvert.serialize(animals)).toEqual(animalJsonArray);
            });
        });
        // DESERIALIZE INTEGRATION
        describe('deserialize', function () {
            it('should deserialize a JSON object to a TypeScript object', function () {
                expect(jsonConvert.deserialize(dog1JsonObject, Dog)).toEqual(dog1);
            });
            it('should deserialize a JSON array to a TypeScript array', function () {
                expect(jsonConvert.deserialize(catsJsonArray, Cat)).toEqual(cats);
            });
        });
    });
});
