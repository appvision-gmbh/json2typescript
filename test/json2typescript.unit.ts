import { JsonConvert } from "../src/json2typescript/json-convert";
import { OperationMode, ValueCheckingMode } from "../src/json2typescript/json-convert-enums";
import { JsonConverter, JsonObject, JsonProperty } from "../src/json2typescript/json-convert-decorators";
import { JsonCustomConvert } from "../src/json2typescript/json-custom-convert";
import { Any } from "../src/json2typescript/any";
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
            catName: "Meowy",
            district: 100,
            owner: human1JsonObject,
            talky: true,
            other: "cute"
        };
        let cat2JsonObject = {
            catName: "Links",
            district: 50,
            owner: human1JsonObject,
            talky: true,
            other: "sweet"
        };
        let dog1JsonObject = {
            name: "Barky",
            barking: true,
            owner: null,
            other: 1.1
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

        @JsonObject()
        class Human {
            @JsonProperty("firstname", String)
            firstname: string = "";
            @JsonProperty("lastname", String)
            lastname: string = "";

            getName() {
                return this.firstname + " " + this.lastname;
            }

            constructor() { this.firstname = "-"; }
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

        @JsonObject("Kitty")
        class Cat extends Animal {
            @JsonProperty("catName", String)
            name: string = undefined;
            @JsonProperty()
            district: number = undefined;
            @JsonProperty()
            talky: boolean = undefined;
            @JsonProperty("other", String)
            other: string = undefined;
        }

        @JsonObject
        class Dog extends Animal {
            @JsonProperty("barking", Boolean)
            isBarking: boolean = undefined;
            @JsonProperty("other", Number)
            other: number = undefined;
        }

        // TYPESCRIPT INSTANCES
        let human1 = new Human();
        human1.firstname = "Andreas";
        human1.lastname = "Muster";
        let human2 = new Human();
        human2.lastname = "-";
        let cat1 = new Cat();
        cat1.name = "Meowy";
        cat1.district = 100;
        cat1.owner = human1;
        cat1.talky = true;
        cat1.other = "cute";
        let cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.owner = human1;
        cat2.other = "sweet";
        let dog1 = new Dog();
        dog1.name = "Barky";
        dog1.isBarking = true;
        dog1.owner = null;
        dog1.other = 1.1;
        let animals = [cat1, dog1];
        let cats = [cat1, cat2];

        console.log(JSON.stringify(Human[Settings.MAPPING_PROPERTY]));
        console.log(JSON.stringify(cat1[Settings.MAPPING_PROPERTY]));

        // SETUP CHECKS
        describe('setup checks', () => {
            it('JsonObject decorator', () => {
                expect(human1[Settings.CLASS_IDENTIFIER]).toEqual("Human");
                expect(cat1[Settings.CLASS_IDENTIFIER]).toEqual("Kitty");
                expect(dog1[Settings.CLASS_IDENTIFIER]).toEqual("Dog");
            });
        });

        // NULL/UNDEFINED CHECKS
        describe('null/undefined checks', () => {
            it('serialize and deserialize null', () => {

                jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

                let t_cat = (<any>jsonConvert).deserialize(null, Cat);
                expect(t_cat).toEqual(null);
                let t_catJsonObject = (<any>jsonConvert).serialize(null);
                expect(t_catJsonObject).toEqual(null);

                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

                expect(() => (<any>jsonConvert).deserialize(null, Cat)).toThrow();
                expect(() => (<any>jsonConvert).serialize(null)).toThrow();

            });
            it('deserialize and serialize undefined', () => {

                jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

                expect(() => (<any>jsonConvert).deserialize(undefined, Cat)).toThrowError();
                let t_catJsonObject = (<any>jsonConvert).serialize(undefined);
                expect(t_catJsonObject).toEqual(null);

                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

                expect(() => (<any>jsonConvert).deserialize(undefined, Cat)).toThrowError();
                expect(() => (<any>jsonConvert).serialize(undefined)).toThrowError();

            });
        });

        // BASIC CHECKS
        describe('basic checks', () => {
            jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

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

            jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

            it('serializeObject_loopProperty()', () => {
                let t_cat = {};
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "name", t_cat)
                expect(t_cat["catName"]).toBe(cat1.name);
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "district", t_cat)
                expect(t_cat["district"]).toBe(100);
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "owner", t_cat)
                expect(t_cat["owner"]["firstname"]).toBe("Andreas");
            });
            it('deserializeObject_loopProperty()', () => {
                let t_cat = new Cat();
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "name", { "catName": "Meowy" });
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

            jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

            it('getClassPropertyMappingOptions()', () => {
                expect((<any>jsonConvert).getClassPropertyMappingOptions(cat1, "name")).not.toBeNull();
                expect((<any>jsonConvert).getClassPropertyMappingOptions(dog1, "name")).not.toBeNull();
                expect((<any>jsonConvert).getClassPropertyMappingOptions(human1, "name")).toBeNull();
            });
            it('verifyProperty()', () => {
                expect((<any>jsonConvert).verifyProperty(String, "Andreas", false)).toBe("Andreas");
                //expect((<any>jsonConvert).verifyProperty(Number, "Andreas", false)).toThrow(undefined);
                expect((<any>jsonConvert).verifyProperty([String, [Boolean, Number]], ["Andreas", [true, 2.2]], false)).toEqual(["Andreas", [true, 2.2]]);
            });

        });

        // JSON2TYPESCRIPT TYPES
        describe('json2typescript types', () => {

            jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

            it('getExpectedType()', () => {
                expect((<any>jsonConvert).getExpectedType(JsonConvert)).toBe("JsonConvert");
                expect((<any>jsonConvert).getExpectedType([String, [Boolean, Number]])).toBe("[string,[boolean,number]]");
                expect((<any>jsonConvert).getExpectedType([[null, Any], Object])).toBe("[[any,any],any]");
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
