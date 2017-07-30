import { JsonConvert } from "../src/json2typescript/json-convert";
import { OperationMode, ValueCheckingMode } from "../src/json2typescript/json-convert-enums";
import { JsonConverter, JsonObject, JsonProperty } from "../src/json2typescript/json-convert-decorators";
import { JsonCustomConvert } from "../src/json2typescript/json-custom-convert";
import { Settings } from "../src/json2typescript/json-convert-options";

describe('Unit tests', () => {

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
            talky: true
        };
        let cat2JsonObject = {
            name: "Links",
            district: 50,
            owner: human1JsonObject,
            talky: true
        };
        let dog1JsonObject = {
            name: "Barky",
            barking: true,
            owner: null
        };
        let animalJsonArray = [cat1JsonObject, dog1JsonObject];
        let catsJsonArray = [cat1JsonObject, cat2JsonObject];

        // TYPESCRIPT CLASSES
        @JsonConverter
        class DateConverter implements JsonCustomConvert<Date> {
            serialize(date: Date): any {
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                return year + "-" + ( month < 10 ? "0" + month : month ) + "-" + ( day < 10 ? "0" + day : day );
            }

            deserialize(date: any): Date {
                return new Date(date);
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
            name: string = undefined;
            @JsonProperty("owner", Human, true)
            owner: Human = undefined;
            @JsonProperty("birthdate", DateConverter)
            birthdate: Date;
        }

        @JsonObject
        class Cat extends Animal {
            @JsonProperty()
            district: number = undefined;
            @JsonProperty()
            talky: boolean = undefined;
        }

        @JsonObject
        class Dog extends Animal {
            @JsonProperty("barking", Boolean)
            isBarking: boolean = undefined;
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
        let cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.owner = human1;
        let dog1 = new Dog();
        dog1.name = "Barky"
        dog1.isBarking = true;
        dog1.owner = null;
        let animals = [cat1, dog1];
        let cats = [cat1, cat2];

        // BASIC CHECKS
        describe('basic checks', () => {
            it('serialize and deserialize same data', () => {
                let t_catJsonObject = (<any>jsonConvert).serialize(cat1);
                expect(t_catJsonObject).toEqual(cat1JsonObject);
                let t_cat = (<any>jsonConvert).deserialize(t_catJsonObject, Cat);
                expect(t_cat).toEqual(cat1);
            });
            it('deserialize and serialize same data', () => {
                let t_cat = (<any>jsonConvert).deserialize(cat1JsonObject, Cat);
                expect(t_cat).toEqual(cat1);
                let t_catJsonObject = (<any>jsonConvert).serialize(t_cat);
                expect(t_catJsonObject).toEqual(cat1JsonObject);
            });
        });

        // PRIVATE METHODS
        describe('private methods', () => {
            it('serializeObject_loopProperty()', () => {
                let t_cat = {};
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "name", t_cat)
                expect(t_cat["name"]).toBe(cat1.name);
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "district", t_cat)
                expect(t_cat["district"]).toBe(100);
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "owner", t_cat)
                expect(t_cat["owner"]["firstname"]).toBe("Andreas");
            });
            it('deserializeObject_loopProperty()', () => {
                let t_cat = new Cat();
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "name", { "name": "Meowy" });
                expect(t_cat.name).toEqual("Meowy");
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "district", { "district": 100 });
                expect(t_cat.district).toEqual(100);
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "owner", {
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
            it('classPropertyHasDecorator()', () => {
                expect((<any>jsonConvert).classPropertyHasDecorator(cat1[Settings.MAPPING_PROPERTY], "name")).toBe(true);
                expect((<any>jsonConvert).classPropertyHasDecorator(dog1[Settings.MAPPING_PROPERTY], "name")).toBe(true);
                expect((<any>jsonConvert).classPropertyHasDecorator(human1[Settings.MAPPING_PROPERTY], "name")).toBe(false);
            });
            it('verifyProperty()', () => {
                expect((<any>jsonConvert).verifyProperty(String, "Andreas", false)).toBe("Andreas");
                //expect((<any>jsonConvert).verifyProperty(Number, "Andreas", false)).toThrow(undefined);
                expect((<any>jsonConvert).verifyProperty([String, [Boolean, Number]], ["Andreas", [true, 2.2]], false)).toEqual(["Andreas", [true, 2.2]]);
            });
        });

        // JSON2TYPESCRIPT TYPES
        describe('json2typescript types', () => {
            it('getExpectedType()', () => {
                expect((<any>jsonConvert).getExpectedType(JsonConvert)).toBe("JsonConvert");
                expect((<any>jsonConvert).getExpectedType([String, [Boolean, Number]])).toBe("[string,[boolean,number]]");
                expect((<any>jsonConvert).getExpectedType([[null, undefined], Object])).toBe("[[any,any],any]");
            });
            it('getJsonType()', () => {
                expect((<any>jsonConvert).getJsonType({ name: "Andreas" })).toBe("object");
                expect((<any>jsonConvert).getJsonType(["a", 0, [true, null]])).toBe("[string,number,[boolean,null]]");
            });
            it('getTrueType()', () => {
                expect((<any>jsonConvert).getTrueType(new JsonConvert())).toBe("object");
                expect((<any>jsonConvert).getTrueType({ name: "Andreas" })).toBe("object");
                expect((<any>jsonConvert).getTrueType("Andreas")).toBe("string");
            });
        });

    });

});