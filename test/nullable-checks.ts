import { JsonConvert } from "../src/json2typescript/json-convert";
import { JsonObject, JsonProperty } from "../src/json2typescript/json-convert-decorators";
import { PropertyConvertingMode, ValueCheckingMode } from "../src/json2typescript/json-convert-enums";

describe("JsonConvert basic type tests", () => {

    // <editor-fold desc="JSON CONVERT INSTANCES">

    const jsonConvertAllowNull = new JsonConvert();
    jsonConvertAllowNull.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

    const jsonConvertAllowObjectNull = new JsonConvert();
    jsonConvertAllowObjectNull.valueCheckingMode = ValueCheckingMode.ALLOW_OBJECT_NULL;

    const jsonConvertNoNull = new JsonConvert();
    jsonConvertNoNull.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

    // </editor-fold>

    // <editor-fold desc="CLASSES">

    @JsonObject("NullPropertyTest")
    class NullPropertyTest {
        @JsonProperty("a", Number)
        a: number | null = null;
        @JsonProperty("b", Number, PropertyConvertingMode.IGNORE_NULLABLE)
        b: number | null = null;
        @JsonProperty("c", Number, PropertyConvertingMode.PASS_NULLABLE)
        c: number | null = null;

        constructor(a?: any, b?: any, c?: any) {
            if (a !== undefined) {
                this.a = a;
            }
            if (b !== undefined) {
                this.b = b;
            }
            if (c !== undefined) {
                this.c = c;
            }
        }
    }

    @JsonObject("UndefinedPropertyTest")
    class UndefinedPropertyTest {
        @JsonProperty("a", Number)
        a: number | undefined = undefined;
        @JsonProperty("b", Number, PropertyConvertingMode.IGNORE_NULLABLE)
        b: number | undefined = undefined;
        @JsonProperty("c", Number, PropertyConvertingMode.PASS_NULLABLE)
        c: number | undefined = undefined;

        constructor(a?: any, b?: any, c?: any) {
            if (a !== undefined) {
                this.a = a;
            }
            if (b !== undefined) {
                this.b = b;
            }
            if (c !== undefined) {
                this.c = c;
            }
        }
    }

    // </editor-fold>

    // <editor-fold desc="TESTS">

    describe("undefined checks", () => {

        describe("serialize", () => {

            it("null allowed", () => {

                let obj;

                expect(() => jsonConvertAllowNull.serializeObject(undefined as any, UndefinedPropertyTest)).toThrowError();

                expect(() => jsonConvertAllowNull.serializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertAllowNull.serializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();

                jsonConvertAllowNull.mapUndefinedToNull = true;
                obj = jsonConvertAllowNull.serializeObject({}, NullPropertyTest);
                expect(obj.a).toEqual(null);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);
                obj = jsonConvertAllowNull.serializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, NullPropertyTest);
                expect(obj.a).toEqual(null);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);
                jsonConvertAllowNull.mapUndefinedToNull = false;

                obj = jsonConvertAllowNull.serializeObject({a: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowNull.serializeObject({a: 0, b: undefined, c: undefined}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowNull.serializeObject({a: 0, b: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowNull.serializeObject({a: 0, b: 0, c: undefined}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowNull.serializeObject({a: 0, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);
                obj = jsonConvertAllowNull.serializeObject({a: 0, b: undefined, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

            it("null objects allowed", () => {

                let obj;

                expect(() => jsonConvertAllowObjectNull.serializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertAllowObjectNull.serializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();

                jsonConvertAllowObjectNull.mapUndefinedToNull = true;
                expect(() => jsonConvertAllowObjectNull.serializeObject({}, NullPropertyTest)).toThrowError();
                expect(() => jsonConvertAllowObjectNull.serializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, NullPropertyTest)).toThrowError();
                jsonConvertAllowObjectNull.mapUndefinedToNull = false;

                obj = jsonConvertAllowObjectNull.serializeObject({a: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowObjectNull.serializeObject({
                    a: 0,
                    b: undefined,
                    c: undefined,
                }, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowObjectNull.serializeObject({a: 0, b: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowObjectNull.serializeObject({a: 0, b: 0, c: undefined}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowObjectNull.serializeObject({a: 0, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);
                obj = jsonConvertAllowObjectNull.serializeObject({a: 0, b: undefined, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

            it("null forbidden", () => {

                let obj;

                expect(() => jsonConvertNoNull.serializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertNoNull.serializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();

                jsonConvertNoNull.mapUndefinedToNull = true;
                expect(() => jsonConvertNoNull.serializeObject({}, NullPropertyTest)).toThrowError();
                expect(() => jsonConvertNoNull.serializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, NullPropertyTest)).toThrowError();
                jsonConvertNoNull.mapUndefinedToNull = false;

                obj = jsonConvertNoNull.serializeObject({a: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertNoNull.serializeObject({a: 0, b: undefined, c: undefined}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertNoNull.serializeObject({a: 0, b: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertNoNull.serializeObject({a: 0, b: 0, c: undefined}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.hasOwnProperty("c")).toEqual(true);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertNoNull.serializeObject({a: 0, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);
                obj = jsonConvertNoNull.serializeObject({a: 0, b: undefined, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.hasOwnProperty("b")).toEqual(false);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

        });

        describe("deserialize", () => {

            it("null allowed", () => {

                let obj;

                expect(() => jsonConvertAllowNull.deserializeObject(undefined as any, UndefinedPropertyTest)).toThrowError();

                expect(() => jsonConvertAllowNull.deserializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertAllowNull.deserializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();

                jsonConvertAllowNull.mapUndefinedToNull = true;
                obj = jsonConvertAllowNull.deserializeObject({}, UndefinedPropertyTest);
                expect(obj.a).toEqual(null);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);
                obj = jsonConvertAllowNull.deserializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest);
                expect(obj.a).toEqual(null);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);
                jsonConvertAllowNull.mapUndefinedToNull = false;

                obj = jsonConvertAllowNull.deserializeObject({a: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowNull.deserializeObject({a: 0, b: undefined, c: undefined}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowNull.deserializeObject({a: 0, b: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowNull.deserializeObject({a: 0, b: 0, c: undefined}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowNull.deserializeObject({a: 0, c: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);
                obj = jsonConvertAllowNull.deserializeObject({a: 0, b: undefined, c: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

            it("null objects allowed", () => {

                let obj;

                expect(() => jsonConvertAllowObjectNull.deserializeObject(undefined as any, UndefinedPropertyTest)).toThrowError();

                expect(() => jsonConvertAllowObjectNull.deserializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertAllowObjectNull.deserializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();

                jsonConvertAllowObjectNull.mapUndefinedToNull = true;
                expect(() => jsonConvertAllowObjectNull.deserializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertAllowObjectNull.deserializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();
                jsonConvertAllowObjectNull.mapUndefinedToNull = false;

                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowObjectNull.deserializeObject({
                    a: 0,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0, b: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0, b: 0, c: undefined}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0, c: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);
                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0, b: undefined, c: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

            it("null forbidden", () => {

                let obj;

                expect(() => jsonConvertNoNull.deserializeObject(undefined as any, UndefinedPropertyTest)).toThrowError();

                expect(() => jsonConvertNoNull.deserializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertNoNull.deserializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();

                jsonConvertNoNull.mapUndefinedToNull = true;
                expect(() => jsonConvertNoNull.deserializeObject({}, UndefinedPropertyTest)).toThrowError();
                expect(() => jsonConvertNoNull.deserializeObject({
                    a: undefined,
                    b: undefined,
                    c: undefined,
                }, UndefinedPropertyTest)).toThrowError();
                jsonConvertNoNull.mapUndefinedToNull = false;

                obj = jsonConvertNoNull.deserializeObject({a: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertNoNull.deserializeObject({a: 0, b: undefined, c: undefined}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertNoNull.deserializeObject({a: 0, b: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(undefined);
                obj = jsonConvertNoNull.deserializeObject({a: 0, b: 0, c: undefined}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(undefined);

                obj = jsonConvertNoNull.deserializeObject({a: 0, c: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);
                obj = jsonConvertNoNull.deserializeObject({a: 0, b: undefined, c: 0}, UndefinedPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

        });

    });

    describe("null checks", () => {

        describe("serialize", () => {

            it("null allowed", () => {

                let obj;

                obj = jsonConvertAllowNull.serializeObject(null as any, NullPropertyTest);
                expect(obj).toEqual(null as any);

                obj = jsonConvertAllowNull.serializeObject({a: null, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(null);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowNull.serializeObject({a: 0, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowNull.serializeObject({a: 0, b: 0, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowNull.serializeObject({a: 0, b: null, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

            it("null object allowed", () => {

                let obj;

                obj = jsonConvertAllowObjectNull.serializeObject(null as any, NullPropertyTest);
                expect(obj).toEqual(null as any);

                expect(() => jsonConvertAllowObjectNull.serializeObject({
                    a: null,
                    b: null,
                    c: null,
                }, NullPropertyTest)).toThrowError();

                obj = jsonConvertAllowObjectNull.serializeObject({a: 0, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowObjectNull.serializeObject({a: 0, b: 0, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowObjectNull.serializeObject({a: 0, b: null, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

            it("null forbidden", () => {

                let obj;

                expect(() => jsonConvertNoNull.serializeObject(null as any, NullPropertyTest)).toThrowError();

                expect(() => jsonConvertNoNull.serializeObject({
                    a: null,
                    b: null,
                    c: null,
                }, NullPropertyTest)).toThrowError();

                obj = jsonConvertNoNull.serializeObject({a: 0, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(null);

                obj = jsonConvertNoNull.serializeObject({a: 0, b: 0, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(null);

                obj = jsonConvertNoNull.serializeObject({a: 0, b: null, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(undefined);
                expect(obj.c).toEqual(0);

            });

        });

        describe("deserialize", () => {

            it("null allowed", () => {

                let obj;

                obj = jsonConvertAllowNull.deserializeObject(null as any, NullPropertyTest);
                expect(obj).toEqual(null as any);

                obj = jsonConvertAllowNull.deserializeObject({a: null, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(null);
                expect(obj.b).toEqual(null);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowNull.deserializeObject({a: 0, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(null);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowNull.deserializeObject({a: 0, b: 0, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowNull.deserializeObject({a: 0, b: null, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(null);
                expect(obj.c).toEqual(0);

            });

            it("null object allowed", () => {

                let obj;

                obj = jsonConvertAllowObjectNull.deserializeObject(null as any, NullPropertyTest);
                expect(obj).toEqual(null as any);

                expect(() => jsonConvertAllowObjectNull.deserializeObject({
                    a: null,
                    b: null,
                    c: null,
                }, NullPropertyTest)).toThrowError();

                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(null);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0, b: 0, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(null);

                obj = jsonConvertAllowObjectNull.deserializeObject({a: 0, b: null, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(null);
                expect(obj.c).toEqual(0);

            });

            it("null forbidden", () => {

                let obj;

                expect(() => jsonConvertNoNull.deserializeObject(null as any, NullPropertyTest)).toThrowError();

                expect(() => jsonConvertNoNull.deserializeObject({
                    a: null,
                    b: null,
                    c: null,
                }, NullPropertyTest)).toThrowError();

                obj = jsonConvertNoNull.deserializeObject({a: 0, b: null, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(null);
                expect(obj.c).toEqual(null);

                obj = jsonConvertNoNull.deserializeObject({a: 0, b: 0, c: null}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(0);
                expect(obj.c).toEqual(null);

                obj = jsonConvertNoNull.deserializeObject({a: 0, b: null, c: 0}, NullPropertyTest);
                expect(obj.a).toEqual(0);
                expect(obj.b).toEqual(null);
                expect(obj.c).toEqual(0);

            });

        });

    });

    // </editor-fold>

});
