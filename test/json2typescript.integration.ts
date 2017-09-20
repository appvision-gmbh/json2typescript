import { JsonConvert } from  "../src/json2typescript/json-convert";
import { JsonObject, JsonProperty, JsonConverter } from  "../src/json2typescript/json-convert-decorators";
import { OperationMode, ValueCheckingMode } from  "../src/json2typescript/json-convert-enums";
import { JsonCustomConvert } from  "../src/json2typescript/json-custom-convert";
import { Any } from "../src/json2typescript/any";

describe('Integration tests', () => {

    describe('JsonConvert', () => {

        // JSONCONVERT INSTANCE
        let jsonConvert = new JsonConvert();
        jsonConvert.operationMode = OperationMode.ENABLE;
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
        jsonConvert.ignorePrimitiveChecks = false;

        // JSON DATA
        let human1JsonObject = {
            firstname: "Andreas",
            lastname: "Muster"
        }
        let cat1JsonObject = {
            name: "Meowy",
            district: 100,
            owner: human1JsonObject,
            birthdate: "2016-01-02",
            friends: []
        };
        let dog1JsonObject = {
            name: "Barky",
            barking: true,
            owner: null,
            birthdate: "2016-01-02",
            friends: []
        };
        let cat2JsonObject = {
            name: "Links",
            district: 50,
            owner: human1JsonObject,
            birthdate: "2016-01-02",
            friends: [cat1JsonObject, dog1JsonObject]
        };
        let animalJsonArray = [cat1JsonObject, dog1JsonObject];
        let catsJsonArray = [cat1JsonObject, cat2JsonObject];

        // TYPESCRIPT CLASSES
        @JsonConverter
        class DateConverter implements JsonCustomConvert<Date> {
            serialize(date: Date): any {
                let year = date.getUTCFullYear();
                let month = date.getUTCMonth() + 1;
                let day = date.getUTCDate();
                return year + "-" + ( month < 10 ? "0" + month : month ) + "-" + ( day < 10 ? "0" + day : day );
            }

            deserialize(date: any): Date {
                return new Date(date + "T00:00:00.000Z");
            }
        }

        @JsonObject
        class Human {
            @JsonProperty("firstname", String)
            firstname: string = "";
            @JsonProperty("lastname", String)
            lastname: string = "";
            getName() { return this.firstname + " " + this.lastname; }
        }

        @JsonObject
        class Animal {
            @JsonProperty("name", String)
            name: string;
            @JsonProperty("owner", Human, true)
            owner: Human;
            @JsonProperty("birthdate", DateConverter)
            birthdate: Date;
            @JsonProperty("friends", [Any], true)
            friends: any[] = [];
        }

        @JsonObject
        class Cat extends Animal {
            @JsonProperty("district", Number)
            district: number;
        }

        @JsonObject
        class Dog extends Animal {
            @JsonProperty("barking", Boolean)
            isBarking: boolean;
        }

        // TYPESCRIPT INSTANCES
        let human1 = new Human();
        human1.firstname = "Andreas";
        human1.lastname = "Muster";
        let cat1 = new Cat();
        cat1.name = "Meowy";
        cat1.district = 100;
        cat1.owner = human1;
        cat1.birthdate = new Date("2016-01-02");
        let dog1 = new Dog();
        dog1.name = "Barky"
        dog1.isBarking = true;
        dog1.owner = null;
        dog1.birthdate = new Date("2016-01-02");
        let cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.owner = human1;
        cat2.birthdate = new Date("2016-01-02");
        cat2.friends = [cat1JsonObject, dog1JsonObject];
        let animals = [cat1, dog1];
        let cats = [cat1, cat2];


        // SERIALIZE INTEGRATION
        describe('serialize', () => {

            it('should serialize a TypeScript object to a JSON object', () => {
                expect(jsonConvert.serialize(cat1)).toEqual(cat1JsonObject);
            });

            it('should serialize a TypeScript array to a JSON array', () => {
                expect(jsonConvert.serialize(animals)).toEqual(animalJsonArray);
            });

        });

        // DESERIALIZE INTEGRATION
        describe('deserialize', () => {

            it('should deserialize a JSON object to a TypeScript object', () => {
                expect(jsonConvert.deserialize(dog1JsonObject, Dog)).toEqual(dog1);
            });

            it('should deserialize a JSON array to a TypeScript array', () => {
                expect(jsonConvert.deserialize(catsJsonArray, Cat)).toEqual(cats);
            });

        });

    });

});