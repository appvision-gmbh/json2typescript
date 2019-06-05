import { JsonConvert } from "../src/json2typescript/json-convert";
import { ValueCheckingMode } from "../src/json2typescript/json-convert-enums";
import { Cat } from "./model/typescript/cat";
import { Human } from "./model/typescript/human";
import { Dog } from "./model/typescript/dog";
import { IHuman } from "./model/json/i-human";
import { ICat } from "./model/json/i-cat";
import { IDog } from "./model/json/i-dog";
import { Animal } from "./model/typescript/animal";
import { Snake } from "./model/typescript/snake";
import { ISnake } from "./model/json/i-snake";

describe('Integration tests', () => {

    const jsonConvert = new JsonConvert();

    describe('JsonConvert', () => {

        // JSON DATA
        let human1JsonObject: IHuman = {
            givenName: "Andreas",
            lastName: "Muster"
        };
        let cat1JsonObject: ICat = {
            catName: "Meowy",
            district: 100,
            owner: human1JsonObject,
            birthdate: "2016-01-02",
            friends: [],
            talky: false,
            other: ""
        };
        let dog1JsonObject: IDog = {
            name: "Barky",
            barking: true,
            birthdate: "2016-01-02",
            friends: [],
            other: 0
        };
        let cat2JsonObject: ICat = {
            catName: "Links",
            district: 50,
            birthdate: "2016-01-02",
            talky: true,
            other: ""
        };               
        let snake1JsonObject : ISnake = {
            snakeName: "Snaky",
            district: 21,
            owner: {
                givenName: "Harry",
                lastName: "Potter"
            }
        };
        let snake2JsonObject = {
            district: 21
        };
        let snake3JsonObject = {
            snakeName: "Snaky",
            district: 21,
            owner: {
                givenName: "Harry"
            }
        };
        let animalJsonArray = [cat1JsonObject, dog1JsonObject];
        let catsJsonArray = [cat1JsonObject, cat2JsonObject];

        // TYPESCRIPT INSTANCES
        let human1 = new Human();
        human1.firstname = "Andreas";
        human1.lastname = "Muster";

        let cat1 = new Cat();
        cat1.name = "Meowy";
        cat1.district = 100;
        cat1.owner = human1;
        cat1.birthdate = new Date("2016-01-02");
        cat1.friends = [];

        let dog1 = new Dog();
        dog1.name = "Barky";
        dog1.isBarking = true;
        dog1.birthdate = new Date("2016-01-02");
        dog1.friends = [];

        let cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.birthdate = new Date("2016-01-02");
        cat2.talky = true;

        let animals = [cat1, dog1];
        let cats = [cat1, cat2];        

        // SERIALIZE INTEGRATION
        describe('serialize', () => {

            jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

            it('should serialize a TypeScript object to a JSON object', () => {
                expect(jsonConvert.serialize<Cat>(cat1)).toEqual(cat1JsonObject);
                expect(jsonConvert.serialize<Cat>(cat2)).toEqual(cat2JsonObject);
                expect(jsonConvert.serialize<Dog>(dog1)).toEqual(dog1JsonObject);
                expect(jsonConvert.serializeObject<Cat>(cat1)).toEqual(cat1JsonObject);
                expect(jsonConvert.serializeObject<Cat>(cat2)).toEqual(cat2JsonObject);
                expect(jsonConvert.serializeObject<Dog>(dog1)).toEqual(dog1JsonObject);

                expect(() => jsonConvert.serializeArray(<any> cat1)).toThrow();
            });

            it('should serialize a TypeScript array to a JSON array', () => {
                expect(jsonConvert.serialize<Animal>(animals)).toEqual(animalJsonArray);
                expect(jsonConvert.serialize<Cat>(cats)).toEqual(catsJsonArray);
                expect(jsonConvert.serializeArray<Animal>(animals)).toEqual(animalJsonArray);
                expect(jsonConvert.serializeArray<Cat>(cats)).toEqual(catsJsonArray);

                expect(() => jsonConvert.serializeArray<Cat>(<any> cat1)).toThrow();
            });

        });

        // DESERIALIZE INTEGRATION
        describe('deserialize', () => {

            jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

            it('should deserialize a JSON object to a TypeScript object', () => {
                expect(jsonConvert.deserialize<Cat>(cat1JsonObject, Cat)).toEqual(cat1);
                expect(jsonConvert.deserialize<Cat>(cat2JsonObject, Cat)).toEqual(cat2);
                expect(jsonConvert.deserialize<Dog>(dog1JsonObject, Dog)).toEqual(dog1);
                expect(jsonConvert.deserializeObject<Cat>(cat1JsonObject, Cat)).toEqual(cat1);
                expect(jsonConvert.deserializeObject<Cat>(cat2JsonObject, Cat)).toEqual(cat2);
                expect(jsonConvert.deserializeObject<Dog>(dog1JsonObject, Dog)).toEqual(dog1);

                expect(() => jsonConvert.deserializeArray<Cat>(<any> cat1JsonObject, Cat)).toThrow();

            });

            it('should deserialize a JSON array to a TypeScript array', () => {
                expect(jsonConvert.deserialize<Cat>(catsJsonArray, Cat)).toEqual(cats);
                expect(jsonConvert.deserializeArray<Cat>(catsJsonArray, Cat)).toEqual(cats);

                expect(() => jsonConvert.deserializeObject<Cat>(catsJsonArray, Cat)).toThrow();
            });

        });

        // TRYDESERIALIZE INTEGRATION
        describe('try deserialize', () => {

            it('should try deserialize a JSON object to a TypeScript object', () => {

                const response1 = jsonConvert.tryDeserialize<Snake>(snake1JsonObject, Snake);
                const expectedSnake1 = new Snake();
                expectedSnake1.name = "Snaky";
                expectedSnake1.district = 21;
                expectedSnake1.owner = new Human();
                expectedSnake1.owner.firstname = "Harry";
                expectedSnake1.owner.lastname = "Potter";

                const expectedError1 = {};

                expect(response1.value).toEqual(expectedSnake1);
                expect(response1.error).toEqual(expectedError1);

                const response2 = jsonConvert.tryDeserialize<Snake>(snake2JsonObject, Snake);
                const expectedSnake2 = new Snake();
                expectedSnake2.name = "";
                expectedSnake2.district = 21;
                expectedSnake2.owner = undefined;

                const expectedError2 = {
                    name: "Failed to map the JSON object to the class \"Snacky\" because the defined JSON property \"snakeName\" does not exist:\n\n",
                    owner: "Failed to map the JSON object to the class \"Snacky\" because the defined JSON property \"owner\" does not exist:\n\n"
                };

                expect(response2.value).toEqual(expectedSnake2);
                expect(response2.error).toEqual(expectedError2);

                const response3 = jsonConvert.tryDeserialize<Snake>(snake3JsonObject, Snake);
                const expectedSnake3 = new Snake();
                expectedSnake3.name = 'Snaky';
                expectedSnake3.district = 21;
                expectedSnake3.owner = new Human();
                expectedSnake3.owner.firstname = "Harry";

                const expectedError3 = {
                    owner: {
                        lastname: "Failed to map the JSON object to the class \"Human\" because the defined JSON property \"lastName\" does not exist:\n\n"
                    }
                };
                
                expect(response3.value).toEqual(expectedSnake3);
                expect(response3.error).toEqual(expectedError3);
            });
        });

        it('should try deserialize a JSON array to a TypeScript object', () => {

            const response = jsonConvert.tryDeserialize<Snake>([snake1JsonObject, snake2JsonObject], Snake);            
            const expectedError1 = {};
            const expectedError2 = {
                name: "Failed to map the JSON object to the class \"Snacky\" because the defined JSON property \"snakeName\" does not exist:\n\n",
                owner: "Failed to map the JSON object to the class \"Snacky\" because the defined JSON property \"owner\" does not exist:\n\n"
            };

            expect(response.error).toEqual([expectedError1, expectedError2]);
        });

    });

});