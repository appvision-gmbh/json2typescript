/**
 * Created by andreas on 15.07.2017.
 */
import { JsonConvert, JsonObject, JsonProperty } from "../src/json2typescript/json-convert";

describe('Integration tests', () => {

    describe('JsonConvert', () => {

        @JsonObject
        class Car {
            @JsonProperty('brand', String, true)
            brand: string = null;
        }

        beforeEach(function () {
            spyOn(console, 'log');
        });

        describe('serializeObject', () => {

            let car: Car;

            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });

            it('should serialize a class to a string', () => {
                let jsonConvert = new JsonConvert();
                let strObject: string = jsonConvert.serializeObject(car);
                expect(strObject).toBe('{"brand":"Brand"}');
            });

        });

        describe('deserialize', () => {

            const strCar: string = '{"brand":"Brand"}';
            const carObj: any = { brand: "Brand" };
            let car: Car;

            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });

            it('should serialize a string to a class', () => {
                let jsonConvert = new JsonConvert();
                let car = jsonConvert.deserialize(strCar, Car);
                expect(car.constructor.name).toBe((<any>Car).name);
                expect(car.brand).toBe('Brand');
            });

            it('should serialize an object to a class', () => {
                let jsonConvert = new JsonConvert();
                let car = jsonConvert.deserialize(carObj, Car);
                expect(car.constructor.name).toBe((<any>Car).name);
                expect(car.brand).toBe('Brand');
            });

        });

        describe('deserializeString', () => {

            const strCar: string = '{"brand":"Brand"}';
            let car: Car;

            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });

            it('should serialize a string to a class', () => {
                let jsonConvert = new JsonConvert();
                let car = jsonConvert.deserializeString(strCar, Car);
                expect(car.constructor.name).toBe((<any>Car).name);
                expect(car.brand).toBe('Brand');
            });

        });

        describe('deserializeObject', () => {

            const carObj: any = { brand: "Brand" };
            let car: Car;

            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
            });

            it('should deserialize a json object to a class', () => {
                let jsonConvert = new JsonConvert();
                let carInstance = jsonConvert.deserializeObject(carObj, Car);
                expect(carInstance).toEqual(car);
            });

        });

        describe('deserializeArray', () => {

            const carArr: any = [{ brand: "Brand" }];
            let cars: Car[] = [];

            beforeEach(function () {
                cars[0] = new Car();
                cars[0].brand = 'Brand';
            });

            it('should deserialize a json array to a array of classes', () => {
                let jsonConvert = new JsonConvert();
                let carsArray = jsonConvert.deserializeArray(carArr, Car);
                expect(carsArray).toEqual(cars);
            });

        });

    });

});