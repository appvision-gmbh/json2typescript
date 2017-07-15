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
                var jsonConvert = new json_convert_1.JsonConvert();
                var strObject = jsonConvert.serializeObject(car);
                expect(strObject).toBe('{"brand":"Brand"}');
            });
        });
        describe('deserialize', function () {
            var strCar = '{"brand":"Brand"}';
            var carObj = { brand: "Brand" };
            var car;
            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });
            it('should serialize a string to a class', function () {
                var jsonConvert = new json_convert_1.JsonConvert();
                var car = jsonConvert.deserialize(strCar, Car);
                expect(car.constructor.name).toBe(Car.name);
                expect(car.brand).toBe('Brand');
            });
            it('should serialize an object to a class', function () {
                var jsonConvert = new json_convert_1.JsonConvert();
                var car = jsonConvert.deserialize(carObj, Car);
                expect(car.constructor.name).toBe(Car.name);
                expect(car.brand).toBe('Brand');
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
                var jsonConvert = new json_convert_1.JsonConvert();
                var car = jsonConvert.deserializeString(strCar, Car);
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
                var jsonConvert = new json_convert_1.JsonConvert();
                var carInstance = jsonConvert.deserializeObject(carObj, Car);
                expect(carInstance).toEqual(car);
            });
        });
        describe('deserializeArray', function () {
            var carArr = [{ brand: "Brand" }];
            var cars = [];
            beforeEach(function () {
                cars[0] = new Car();
                cars[0].brand = 'Brand';
            });
            it('should deserialize a json array to a array of classes', function () {
                var jsonConvert = new json_convert_1.JsonConvert();
                var carsArray = jsonConvert.deserializeArray(carArr, Car);
                expect(carsArray).toEqual(cars);
            });
        });
    });
});
