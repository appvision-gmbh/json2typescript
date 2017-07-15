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
describe('Unit tests', function () {
    describe('JsonConvert', function () {
        var Car = (function () {
            function Car() {
                this.brand = null;
            }
            return Car;
        }());
        __decorate([
            json_convert_1.JsonProperty('brand', String, true)
        ], Car.prototype, "brand", void 0);
        Car = __decorate([
            json_convert_1.JsonObject
        ], Car);
        beforeEach(function () {
            spyOn(console, 'log');
        });
        describe('serializeObject', function () {
            var car;
            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });
            it('should serialize an object to a string', function () {
                var strObject = json_convert_1.JsonConvert.serializeObject(car);
                expect(strObject).toBe('{"brand":"Brand"}');
            });
            it('should log something when debug mode is enabled', function () {
                json_convert_1.JsonConvert.debugMode = true;
                json_convert_1.JsonConvert.serializeObject(car);
                expect(console.log).toHaveBeenCalled();
            });
            it('should not log anything when debug mode is disabled', function () {
                json_convert_1.JsonConvert.debugMode = false;
                json_convert_1.JsonConvert.serializeObject(car);
                expect(console.log).not.toHaveBeenCalled();
            });
        });
        describe('deserializeString', function () {
            var strCar = '{"brand":"Brand"}';
            var car;
            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
                spyOn(json_convert_1.JsonConvert, 'deserializeObject').and.returnValue(car);
            });
            it('should serialize a string to a class', function () {
                var carInstance = json_convert_1.JsonConvert.deserializeString(strCar, Car);
                expect(json_convert_1.JsonConvert.deserializeObject).toHaveBeenCalled();
                expect(carInstance.constructor.name).toBe(Car.name);
                expect(carInstance.brand).toBe(car.brand);
            });
            it('should throw an error when trying to deserialize an object', function () {
                expect(function () {
                    json_convert_1.JsonConvert.deserializeString({ brand: "Brand" }, Car);
                }).toThrowError();
            });
            it('should log something when debug mode is enabled', function () {
                json_convert_1.JsonConvert.debugMode = true;
                json_convert_1.JsonConvert.deserializeString(strCar, Car);
                expect(console.log).toHaveBeenCalled();
            });
            it('should not log anything when debug mode is disabled', function () {
                json_convert_1.JsonConvert.debugMode = false;
                json_convert_1.JsonConvert.deserializeString(strCar, Car);
                expect(console.log).not.toHaveBeenCalled();
            });
        });
        describe('deserializeObject', function () {
            var Truck = (function (_super) {
                __extends(Truck, _super);
                function Truck() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.isBig = null;
                    return _this;
                }
                return Truck;
            }(Car));
            __decorate([
                json_convert_1.JsonProperty('isBig', Boolean, true)
            ], Truck.prototype, "isBig", void 0);
            Truck = __decorate([
                json_convert_1.JsonObject
            ], Truck);
            var carStr = '{"brand":"Brand"}';
            var carObj = { brand: "Brand" };
            var car;
            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
                spyOn(json_convert_1.JsonConvert, 'deserializeObject_loopProperty').and.callFake(function (classInstance, propertyKey, json) {
                    classInstance[propertyKey] = json[propertyKey];
                });
            });
            it('should deserialize a json object to a class', function () {
                var carInstance = json_convert_1.JsonConvert.deserializeObject(carObj, Car);
                expect(json_convert_1.JsonConvert.deserializeObject_loopProperty).toHaveBeenCalled();
                expect(carInstance).toEqual(car);
            });
            it('should throw an error when not given an object and not given an array', function () {
                expect(function () {
                    json_convert_1.JsonConvert.deserializeObject('{}', Car);
                }).toThrowError();
            });
            it('should throw an error when [not given an object and] given an array', function () {
                expect(function () {
                    json_convert_1.JsonConvert.deserializeObject([], Car);
                }).toThrowError();
            });
            it('should log something when debug mode is enabled', function () {
                json_convert_1.JsonConvert.debugMode = true;
                json_convert_1.JsonConvert.deserializeObject(carObj, Car);
                expect(console.log).toHaveBeenCalled();
            });
            it('should not log anything when debug mode is disabled', function () {
                json_convert_1.JsonConvert.debugMode = false;
                json_convert_1.JsonConvert.deserializeObject(carObj, Car);
                expect(console.log).not.toHaveBeenCalled();
            });
            it('should loop through all properties of given object', function () {
                json_convert_1.JsonConvert.deserializeObject(new Truck(), Truck);
                expect(json_convert_1.JsonConvert.deserializeObject_loopProperty).toHaveBeenCalledTimes(2);
            });
        });
    });
});
