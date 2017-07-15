import {JsonConvert, JsonObject, JsonProperty} from "../src/json2typescript/json-convert";

describe('Unit tests', () => {

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

            it('should serialize an object to a string', () => {
                let strObject: string = JsonConvert.serializeObject(car);
                expect(strObject).toBe('{"brand":"Brand"}');
            });

            it('should log something when debug mode is enabled', () => {
                JsonConvert.debugMode = true;
                JsonConvert.serializeObject(car);
                expect(console.log).toHaveBeenCalled();
            });

            it('should not log anything when debug mode is disabled', () => {
                JsonConvert.debugMode = false;
                JsonConvert.serializeObject(car);
                expect(console.log).not.toHaveBeenCalled();
            });

        });

        describe('deserializeString', () => {

            const strCar: string = '{"brand":"Brand"}';
            let car: Car;

            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
                spyOn(JsonConvert, 'deserializeObject').and.returnValue(car);
            });

            it('should serialize a string to a class', () => {
                let carInstance = JsonConvert.deserializeString(strCar, Car);
                expect(JsonConvert.deserializeObject).toHaveBeenCalled();
                expect(carInstance.constructor.name).toBe((<any>Car).name);
                expect(carInstance.brand).toBe(car.brand);
            });

            it('should throw an error when trying to deserialize an object', () => {
                expect(() => {
                    JsonConvert.deserializeString({brand: "Brand"} as any, Car)
                }).toThrowError();
            });

            it('should log something when debug mode is enabled', () => {
                JsonConvert.debugMode = true;
                JsonConvert.deserializeString(strCar, Car);
                expect(console.log).toHaveBeenCalled();
            });

            it('should not log anything when debug mode is disabled', () => {
                JsonConvert.debugMode = false;
                JsonConvert.deserializeString(strCar, Car);
                expect(console.log).not.toHaveBeenCalled();
            });

        });

        describe('deserializeObject', () => {

            @JsonObject
            class Truck extends Car {
                @JsonProperty('isBig', Boolean, true)
                isBig: boolean = null;
            }

            const carStr: string = '{"brand":"Brand"}';
            const carObj: any = {brand: "Brand"};
            let car: Car;

            beforeEach(function () {
                car = new Car();
                car.brand = 'Brand';
                spyOn(<any>JsonConvert, 'deserializeObject_loopProperty').and.callFake((classInstance: any, propertyKey: string, json: Object) => {
                    classInstance[propertyKey] = json[propertyKey];
                });
            });

            it('should deserialize a json object to a class', () => {
                let carInstance = JsonConvert.deserializeObject(carObj, Car);
                expect((<any>JsonConvert).deserializeObject_loopProperty).toHaveBeenCalled();
                expect(carInstance).toEqual(car);
            });

            it('should throw an error when not given an object and not given an array', () => {
                expect(() => {
                    JsonConvert.deserializeObject('{}', Car);
                }).toThrowError();
            });

            it('should throw an error when [not given an object and] given an array', () => {
                expect(() => {
                    JsonConvert.deserializeObject([], Car);
                }).toThrowError();
            });

            it('should log something when debug mode is enabled', () => {
                JsonConvert.debugMode = true;
                JsonConvert.deserializeObject(carObj, Car);
                expect(console.log).toHaveBeenCalled();
            });

            it('should not log anything when debug mode is disabled', () => {
                JsonConvert.debugMode = false;
                JsonConvert.deserializeObject(carObj, Car);
                expect(console.log).not.toHaveBeenCalled();
            });

            it('should loop through all properties of given object', () => {
                JsonConvert.deserializeObject(new Truck(), Truck);
                expect((<any>JsonConvert).deserializeObject_loopProperty).toHaveBeenCalledTimes(2);
            });

        });

    });

});