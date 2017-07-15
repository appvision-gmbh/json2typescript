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
                let strObject: string = JsonConvert.serializeObject(car);
                expect(strObject).toBe('{"brand":"Brand"}');
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
                let car = JsonConvert.deserializeString(strCar, Car);
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
                let carInstance = JsonConvert.deserializeObject(carObj, Car);
                expect(carInstance).toEqual(car);
            });

        });

    });

});