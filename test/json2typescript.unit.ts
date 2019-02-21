import { JsonConvert } from "../src/json2typescript/json-convert";
import { OperationMode, PropertyMatchingRule, ValueCheckingMode } from "../src/json2typescript/json-convert-enums";
import { Any } from "../src/json2typescript/any";
import { Settings } from "../src/json2typescript/json-convert-options";
import { Human } from "./model/typescript/human";
import { Cat } from "./model/typescript/cat";
import { Dog } from "./model/typescript/dog";
import { IHuman } from "./model/json/i-human";
import { ICat } from "./model/json/i-cat";
import { IDog } from "./model/json/i-dog";

describe('Unit tests', () => {

    const jsonConvert = new JsonConvert();

    describe('JsonConvert', () => {

        // JSON DATA
        let human1JsonObject: IHuman = {
            givenName: "Andreas",
            lastName: "Muster"
        };
        let human2JsonObject: IHuman = {
            givenName: "Michael",
            name: "Meier"
        };
        let cat1JsonObject: ICat = {
            catName: "Meowy",
            district: 100,
            owner: human1JsonObject,
            talky: true,
            other: "cute",
            friends: []
        };
        let cat2JsonObject: ICat = {
            catName: "Links",
            district: 50,
            talky: true,
            other: "sweet",
            birthdate: "2014-09-01",
            friends: null
        };
        let dog1JsonObject: IDog = {
            name: "Barky",
            barking: true,
            other: 1.1,
        };

        // TYPESCRIPT INSTANCES
        let human1 = new Human();
        human1.firstname = "Andreas";
        human1.lastname = "Muster";

        let human2 = new Human();
        human2.firstname = "Michael";
        human2.lastname = "Meier";

        let cat1 = new Cat();
        cat1.name = "Meowy";
        cat1.district = 100;
        cat1.owner = human1;
        cat1.talky = true;
        cat1.other = "cute";
        cat1.friends = [];

        let cat2 = new Cat();
        cat2.name = "Links";
        cat2.district = 50;
        cat2.other = "sweet";
        cat2.birthdate = new Date("2014-09-01");
        cat2.friends = null;
        cat2.talky = true;

        let dog1 = new Dog();
        dog1.name = "Barky";
        dog1.isBarking = true;
        dog1.owner = null;
        dog1.other = 1.1;

        // SETUP CHECKS
        describe('setup checks', () => {
            it('JsonConvert instance', () => {

                let jsonConvertTest: JsonConvert;

                jsonConvertTest = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_OBJECT_NULL, false);
                expect(jsonConvertTest.operationMode).toEqual(OperationMode.ENABLE);
                expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.ALLOW_OBJECT_NULL);
                expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(false);

                jsonConvertTest = new JsonConvert(OperationMode.DISABLE, ValueCheckingMode.ALLOW_NULL, true);
                expect(jsonConvertTest.operationMode).toEqual(OperationMode.DISABLE);
                expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.ALLOW_NULL);
                expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(true);

                jsonConvertTest = new JsonConvert(OperationMode.LOGGING, ValueCheckingMode.DISALLOW_NULL, false);
                expect(jsonConvertTest.operationMode).toEqual(OperationMode.LOGGING);
                expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.DISALLOW_NULL);
                expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(false);

                jsonConvertTest = new JsonConvert();
                expect(jsonConvertTest.operationMode).toEqual(OperationMode.ENABLE);
                expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.ALLOW_OBJECT_NULL);
                expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(false);

            });

            it('JsonObject decorator', () => {
                expect((<any>human1)[Settings.CLASS_IDENTIFIER]).toEqual("Human");
                expect((<any>cat1)[Settings.CLASS_IDENTIFIER]).toEqual("Kitty");
                expect((<any>dog1)[Settings.CLASS_IDENTIFIER]).toEqual("Dog");
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
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "name", t_cat);
                expect((<any>t_cat)["catName"]).toBe(cat1.name);
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "district", t_cat);
                expect((<any>t_cat)["district"]).toBe(100);
                (<any>jsonConvert).serializeObject_loopProperty(cat1, "owner", t_cat);
                expect((<any>t_cat)["owner"]["givenName"]).toBe("Andreas");
            });
            it('deserializeObject_loopProperty()', () => {
                let t_cat = new Cat();
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "name", {"catName": "Meowy"});
                expect(t_cat.name).toEqual("Meowy");
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "district", {"district": 100});
                expect(t_cat.district).toEqual(100);
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "owner", {
                    "owner": {
                        givenName: "Andreas",
                        lastName: "Muster"
                    }
                });
                expect(t_cat.owner!.lastname).toEqual("Muster");

                let t_dog = new Dog();
                (<any>jsonConvert).deserializeObject_loopProperty(t_dog, "name", {"name": "Barky"});
                expect(t_dog.name).toEqual("Barky");

                jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_INSENSITIVE;

                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "name", {"catName": "Meowy"});
                expect(t_cat.name).toEqual("Meowy");
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "name", {"catNAME": "Meowy"});
                expect(t_cat.name).toEqual("Meowy");
                expect(() => (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "name", {"catNames": "Meowy"})).toThrow();

                jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_STRICT;

            });

            jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

            it('serializeObject_loopProperty()', () => {
                let t_cat = {};
                (<any>jsonConvert).serializeObject_loopProperty(cat2, "owner", t_cat);
                expect((<any>t_cat)["owner"]).toBe(undefined);
            });
            it('deserializeObject_loopProperty()', () => {
                let t_cat = new Cat();
                (<any>jsonConvert).deserializeObject_loopProperty(t_cat, "owner", { "owner": null });
                expect(t_cat.owner).toBe(null);

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
                expect((<any>jsonConvert).verifyProperty([String, [Boolean, Number]], ["Andreas", [true, 2.2]], false)).toEqual(["Andreas", [true, 2.2]]);
                expect(() => (<any>jsonConvert).verifyProperty(Number, "Andreas", false)).toThrow();
            });
            it('getObjectValue()', () => {
                expect((<any>jsonConvert).getObjectValue({ "name": "Andreas" }, "name")).toBe("Andreas");
                expect(() => (<any>jsonConvert).getObjectValue({ "nAmE": "Andreas" }, "NaMe")).toThrow();

                jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_INSENSITIVE;

                expect((<any>jsonConvert).getObjectValue({ "nAmE": "Andreas" }, "NaMe")).toBe("Andreas");

                jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_STRICT;
            });

        });

        // JSON2TYPESCRIPT TYPES
        describe('json2typescript types', () => {

            jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

            it('getExpectedType()', () => {
                expect((<any>jsonConvert).getExpectedType(JsonConvert)).toBe("JsonConvert");
                expect((<any>jsonConvert).getExpectedType([String, [Boolean, Number]])).toBe("[string,[boolean,number]]");
                expect((<any>jsonConvert).getExpectedType([[null, Any], Object])).toBe("[[any,any],any]");
                expect((<any>jsonConvert).getExpectedType(undefined)).toBe("undefined");
                expect((<any>jsonConvert).getExpectedType("?")).toBe("?????");
            });
            it('getJsonType()', () => {
                expect((<any>jsonConvert).getJsonType({name: "Andreas"})).toBe("object");
                expect((<any>jsonConvert).getJsonType(["a", 0, [true, null]])).toBe("[string,number,[boolean,null]]");
            });
            it('getTrueType()', () => {
                expect((<any>jsonConvert).getTrueType(new JsonConvert())).toBe("object");
                expect((<any>jsonConvert).getTrueType({name: "Andreas"})).toBe("object");
                expect((<any>jsonConvert).getTrueType("Andreas")).toBe("string");
            });

        });

    });

});
