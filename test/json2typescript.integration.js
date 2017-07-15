"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by andreas on 15.07.2017.
 */
var json_convert_1 = require("../src/json2typescript/json-convert");
describe('Integration tests', function () {
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
            it('should serialize a class to a string', function () {
                var strObject = json_convert_1.JsonConvert.serializeObject(car);
                expect(strObject).toBe('{"brand":"Brand"}');
            });
        });
        describe('deserializeString', function () {
            var strCar = '{"brand":"Brand"}';
            var car;
            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });
            it('should serialize a string to a class', function () {
                var car = json_convert_1.JsonConvert.deserializeString(strCar, Car);
                expect(car.constructor.name).toBe(Car.name);
                expect(car.brand).toBe('Brand');
            });
        });
        describe('deserializeObject', function () {
            var carObj = { brand: "Brand" };
            var car;
            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });
            it('should deserialize a json object to a class', function () {
                var carInstance = json_convert_1.JsonConvert.deserializeObject(carObj, Car);
                expect(carInstance).toEqual(car);
            });
        });
    });
});
