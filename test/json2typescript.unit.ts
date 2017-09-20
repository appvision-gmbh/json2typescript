import { JsonConvert } from "../src/json2typescript/json-convert";
import { OperationMode, ValueCheckingMode } from "../src/json2typescript/json-convert-enums";
import { JsonConverter, JsonObject, JsonProperty } from "../src/json2typescript/json-convert-decorators";
import { JsonCustomConvert } from "../src/json2typescript/json-custom-convert";
import { Settings } from "../src/json2typescript/json-convert-options";
import { Any } from "../src/json2typescript/any";

describe('Unit tests', () => {

    describe('JsonConvert', () => {

        // JSONCONVERT INSTANCE
        let jsonConvert: any = new JsonConvert();
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
            talky: true,
            other: "cute",
            birthdate: "2016-01-02",
        };
        let cat2JsonObject = {
            name: "Links",
            district: 50,
            owner: human1JsonObject,
            talky: true,
            other: "sweet",
            birthdate: "2016-01-02",
        };
        let dog1JsonObject = {
            name: "Barky",
            barking: true,
            owner: null,
            other: 1.1,
            birthdate: "2016-01-02",
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

            getName() {
                return this.firstname + " " + this.lastname;
            }
        }

        @JsonObject
        class Animal {
            @JsonProperty("name", String)
            name: string;
            @JsonProperty("owner", Human, true)
            owner: Human;
            @JsonProperty("birthdate", DateConverter)
            birthdate: Date;
        }

        @JsonObject
        class Cat extends Animal {
            @JsonProperty()
            district: number;
            @JsonProperty()
            talky: boolean;
            @JsonProperty("other", String)
            other: string;
        }

        @JsonObject
        class Dog extends Animal {
            @JsonProperty("barking", Boolean)
            isBarking: boolean;
            @JsonProperty("other", Number)
            other: number;
        }

        // TYPESCRIPT INSTANCES
        let human1 = new Human();
        human1.firstname = "Andreas";
        human1.lastname = "Muster";
        let cat1 = new Cat();
        cat1.name = "Meowy";
        cat1.district = 100;
        cat1.owner = human1;
        cat1.talky = true;
        cat1.other = "cute";
        cat1.birthdate = new Date("2016-01-02");
        let cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.owner = human1;
        cat2.other = "sweet";
        cat2.birthdate = new Date("2016-01-02");
        let dog1 = new Dog();
        dog1.name = "Barky";
        dog1.isBarking = true;
        dog1.owner = null;
        dog1.other = 1.1;
        dog1.birthdate = new Date("2016-01-02");
        let animals = [cat1, dog1];
        let cats = [cat1, cat2];

        // BASIC CHECKS
        describe('basic checks', () => {
            describe('serialize and deserialize same data', () => {
                let t_catJsonObject = jsonConvert.serialize(cat1);
                let t_cat = jsonConvert.deserialize(t_catJsonObject, Cat);
                it('serialization', () => {
                    expect(t_catJsonObject).toEqual(cat1JsonObject);
                });
                it('deserializization', () => {
                    expect(t_cat).toEqual(cat1);
                });
            });
            describe('deserialize and serialize same data', () => {
                let t_cat = jsonConvert.deserialize(cat1JsonObject, Cat);
                let t_catJsonObject = jsonConvert.serialize(t_cat);
                it('deserializization', () => {
                    expect(t_cat).toEqual(cat1);
                });
                it('serialization', () => {
                    expect(t_catJsonObject).toEqual(cat1JsonObject);
                });
            });
        });

        // PRIVATE METHODS
        describe('private methods', () => {
            it('serializeObject_loopProperty()', () => {
                let t_cat = {};
                jsonConvert.serializeObject_loopProperty(cat1, "name", t_cat)
                expect(t_cat["name"]).toBe(cat1.name);
                jsonConvert.serializeObject_loopProperty(cat1, "district", t_cat)
                expect(t_cat["district"]).toBe(100);
                jsonConvert.serializeObject_loopProperty(cat1, "owner", t_cat)
                expect(t_cat["owner"]["firstname"]).toBe("Andreas");
            });
            it('deserializeObject_loopProperty()', () => {
                let t_cat = new Cat();
                jsonConvert.deserializeObject_loopProperty(t_cat, "name", { "name": "Meowy" });
                expect(t_cat.name).toEqual("Meowy");
                jsonConvert.deserializeObject_loopProperty(t_cat, "district", { "district": 100 });
                expect(t_cat.district).toEqual(100);
                jsonConvert.deserializeObject_loopProperty(t_cat, "owner", {
                    "owner": {
                        firstname: "Andreas",
                        lastname: "Muster"
                    }
                });
                expect(t_cat.owner.firstname).toEqual("Andreas");
            });
        });

        // HELPER METHODS
        describe('helper methods', () => {
            it('getClassPropertyMappingOptions()', () => {
                expect(jsonConvert.getClassPropertyMappingOptions(cat1, "name")).not.toBeNull();
                expect(jsonConvert.getClassPropertyMappingOptions(dog1, "name")).not.toBeNull();
                expect(jsonConvert.getClassPropertyMappingOptions(human1, "name")).toBeNull();
            });
            it('verifyProperty()', () => {
                expect(jsonConvert.verifyProperty(String, "Andreas", false)).toBe("Andreas");
                //expect((<any>jsonConvert).verifyProperty(Number, "Andreas", false)).toThrow(undefined);
                expect(jsonConvert.verifyProperty([String, [Boolean, Number]], ["Andreas", [true, 2.2]], false)).toEqual(["Andreas", [true, 2.2]]);
            });
        });

        // JSON2TYPESCRIPT TYPES
        describe('json2typescript types', () => {
            it('getExpectedType()', () => {
                expect(jsonConvert.getExpectedType(JsonConvert)).toBe("JsonConvert");
                expect(jsonConvert.getExpectedType([String, [Boolean, Number]])).toBe("[string,[boolean,number]]");
                expect(jsonConvert.getExpectedType([[null, Any], Object])).toBe("[[any,any],any]");
            });
            it('getJsonType()', () => {
                expect(jsonConvert.getJsonType({ name: "Andreas" })).toBe("object");
                expect(jsonConvert.getJsonType(["a", 0, [true, null]])).toBe("[string,number,[boolean,null]]");
            });
            it('getTrueType()', () => {
                expect(jsonConvert.getTrueType(new JsonConvert())).toBe("object");
                expect(jsonConvert.getTrueType({ name: "Andreas" })).toBe("object");
                expect(jsonConvert.getTrueType("Andreas")).toBe("string");
            });
        });

    });

});