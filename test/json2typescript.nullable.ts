import { JsonConvert } from "../src/json2typescript/json-convert";
import { JsonObject, JsonProperty } from "../src/json2typescript/json-convert-decorators";
import { PropertyConvertingMode, ValueCheckingMode } from "../src/json2typescript/json-convert-enums";

describe("JsonConvert nullable type tests", () => {

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
    }

    @JsonObject("UndefinedPropertyTest")
    class UndefinedPropertyTest {
        @JsonProperty("a", Number)
        a: number | undefined = undefined;
        @JsonProperty("b", Number, PropertyConvertingMode.IGNORE_NULLABLE)
        b: number | undefined = undefined;
        @JsonProperty("c", Number, PropertyConvertingMode.PASS_NULLABLE)
        c: number | undefined = undefined;
    }

    // </editor-fold>

    // <editor-fold desc="TESTS">

    describe("undefined property checks", () => {

        describe("serialize", () => {

            it("null allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: undefined,
                        throws: true,
                    },
                    {
                        data: undefined,
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {},
                        expected: {a: null, b: undefined, c: null},
                        mapUndefinedToNull: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        expected: {a: null, b: undefined, c: null},
                        mapUndefinedToNull: true,
                    },
                    {
                        data: {a: 0, b: undefined, c: undefined},
                        expected: {a: 0, b: undefined, c: undefined},
                    },
                    {
                        data: {a: 0, b: 0, c: undefined},
                        expected: {a: 0, b: 0, c: undefined},
                    },
                    {
                        data: {a: 0, b: undefined, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertAllowNull,
                        test.data,
                        UndefinedPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null objects allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: undefined,
                        throws: true,
                    },
                    {
                        data: undefined,
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: 0, b: undefined, c: undefined},
                        expected: {a: 0, b: undefined, c: undefined},
                    },
                    {
                        data: {a: 0, b: 0, c: undefined},
                        expected: {a: 0, b: 0, c: undefined},
                    },
                    {
                        data: {a: 0, b: undefined, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertAllowObjectNull,
                        test.data,
                        UndefinedPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null forbidden", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: undefined,
                        throws: true,
                    },
                    {
                        data: undefined,
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: 0, b: undefined, c: undefined},
                        expected: {a: 0, b: undefined, c: undefined},
                    },
                    {
                        data: {a: 0, b: 0, c: undefined},
                        expected: {a: 0, b: 0, c: undefined},
                    },
                    {
                        data: {a: 0, b: undefined, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertNoNull,
                        test.data,
                        UndefinedPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

        });

        describe("deserialize", () => {

            it("null allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: undefined,
                        throws: true,
                    },
                    {
                        data: undefined,
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {},
                        expected: {a: null, b: undefined, c: null},
                        mapUndefinedToNull: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        expected: {a: null, b: undefined, c: null},
                        mapUndefinedToNull: true,
                    },
                    {
                        data: {a: 0, b: undefined, c: undefined},
                        expected: {a: 0, b: undefined, c: undefined},
                    },
                    {
                        data: {a: 0, b: 0, c: undefined},
                        expected: {a: 0, b: 0, c: undefined},
                    },
                    {
                        data: {a: 0, b: undefined, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertAllowNull,
                        test.data,
                        UndefinedPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null objects allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: undefined,
                        throws: true,
                    },
                    {
                        data: undefined,
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: 0, b: undefined, c: undefined},
                        expected: {a: 0, b: undefined, c: undefined},
                    },
                    {
                        data: {a: 0, b: 0, c: undefined},
                        expected: {a: 0, b: 0, c: undefined},
                    },
                    {
                        data: {a: 0, b: undefined, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertAllowObjectNull,
                        test.data,
                        UndefinedPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null forbidden", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: undefined,
                        throws: true,
                    },
                    {
                        data: undefined,
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        throws: true,
                    },
                    {
                        data: {a: undefined, b: undefined, c: undefined},
                        mapUndefinedToNull: true,
                        throws: true,
                    },
                    {
                        data: {a: 0, b: undefined, c: undefined},
                        expected: {a: 0, b: undefined, c: undefined},
                    },
                    {
                        data: {a: 0, b: 0, c: undefined},
                        expected: {a: 0, b: 0, c: undefined},
                    },
                    {
                        data: {a: 0, b: undefined, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertNoNull,
                        test.data,
                        UndefinedPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

        });

    });

    describe("null property checks", () => {

        describe("serialize", () => {

            it("null allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: null,
                        expected: null,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {a: null, b: null, c: null},
                        expected: {a: null, b: undefined, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: null},
                        expected: {a: 0, b: undefined, c: null},
                    },
                    {
                        data: {a: 0, b: 0, c: null},
                        expected: {a: 0, b: 0, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertAllowNull,
                        test.data,
                        NullPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null object allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: null,
                        expected: null,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {a: null, b: null, c: null},
                        throws: true,
                    },
                    {
                        data: {a: 0, b: null, c: null},
                        expected: {a: 0, b: undefined, c: null},
                    },
                    {
                        data: {a: 0, b: 0, c: null},
                        expected: {a: 0, b: 0, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertAllowObjectNull,
                        test.data,
                        NullPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null forbidden", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: null,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {a: null, b: null, c: null},
                        throws: true,
                    },
                    {
                        data: {a: 0, b: null, c: null},
                        expected: {a: 0, b: undefined, c: null},
                    },
                    {
                        data: {a: 0, b: 0, c: null},
                        expected: {a: 0, b: 0, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: 0},
                        expected: {a: 0, b: undefined, c: 0},
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertNoNull,
                        test.data,
                        NullPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

        });

        describe("deserialize", () => {

            it("null allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: null,
                        expected: null,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {a: null, b: null, c: null},
                        expected: {a: null, b: null, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: null},
                        expected: {a: 0, b: null, c: null},
                    },
                    {
                        data: {a: 0, b: 0, c: null},
                        expected: {a: 0, b: 0, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: 0},
                        expected: {a: 0, b: null, c: 0},
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertAllowNull,
                        test.data,
                        NullPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null object allowed", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: null,
                        expected: null,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {a: null, b: null, c: null},
                        throws: true,
                    },
                    {
                        data: {a: 0, b: null, c: null},
                        expected: {a: 0, b: null, c: null},
                    },
                    {
                        data: {a: 0, b: 0, c: null},
                        expected: {a: 0, b: 0, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: 0},
                        expected: {a: 0, b: null, c: 0},
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertAllowObjectNull,
                        test.data,
                        NullPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

            it("null forbidden", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    {
                        data: null,
                        throws: true,
                    },
                    {
                        data: {},
                        throws: true,
                    },
                    {
                        data: {a: null, b: null, c: null},
                        throws: true,
                    },
                    {
                        data: {a: 0, b: null, c: null},
                        expected: {a: 0, b: null, c: null},
                    },
                    {
                        data: {a: 0, b: 0, c: null},
                        expected: {a: 0, b: 0, c: null},
                    },
                    {
                        data: {a: 0, b: null, c: 0},
                        expected: {a: 0, b: null, c: 0},
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertNoNull,
                        test.data,
                        NullPropertyTest,
                        test.expected,
                        test.mapUndefinedToNull,
                        test.throws,
                    );
                }

            });

        });

    });

    // </editor-fold>

    // <editor-fold desc="TEST METHODS">

    /**
     * Generic method for serializing data.
     */
    function serializeData(jsonConvert: JsonConvert,
                           data: any,
                           classReference: any,
                           expectedResult: any,
                           mapUndefinedToNull: boolean = false,
                           throws: boolean = false): void {

        jsonConvert.mapUndefinedToNull = mapUndefinedToNull === true;

        if (throws) {
            expect(() => jsonConvert.serialize(data, classReference)).toThrowError();
        } else {

            const result: any = jsonConvert.serialize(data, classReference);

            if (result === undefined || result === null) {
                expect(result).toEqual(expectedResult);
                return;
            }

            Object.keys(result).forEach((key: string) => {
                const value = result[key];
                expect(value).toEqual(expectedResult[key]);
            });

        }

        jsonConvert.mapUndefinedToNull = false;

    }

    /**
     * Generic method for deserializing data.
     */
    function deserializeData(jsonConvert: JsonConvert,
                             data: any,
                             classReference: any,
                             expectedResult: any,
                             mapUndefinedToNull: boolean = false,
                             throws: boolean = false): void {

        jsonConvert.mapUndefinedToNull = mapUndefinedToNull === true;

        if (throws) {

            expect(() => jsonConvert.deserialize(data, classReference)).toThrowError();

        } else {

            const result: any = jsonConvert.deserialize(data, classReference);

            if (result === undefined || result === null) {
                expect(result).toEqual(expectedResult);
                return;
            }

            Object.keys(result).forEach((key: string) => {
                const value = result[key];
                expect(value).toEqual(expectedResult[key]);
            });

        }

        jsonConvert.mapUndefinedToNull = false;

    }

    // </editor-fold>

});
