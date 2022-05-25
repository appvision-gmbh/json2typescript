import { JsonConvert } from "../src/json2typescript/json-convert";
import { JsonObject, JsonProperty } from "../src/json2typescript/json-convert-decorators";
import { PropertyConvertingMode, ValueCheckingMode } from "../src/json2typescript/json-convert-enums";

describe("JsonConvert primitive type tests", () => {

    // <editor-fold desc="JSON CONVERT INSTANCES">

    const jsonConvertIgnorePrimitives = new JsonConvert();
    jsonConvertIgnorePrimitives.ignorePrimitiveChecks = true;

    const jsonConvertCheckPrimitives = new JsonConvert();
    jsonConvertCheckPrimitives.ignorePrimitiveChecks = false;

    // </editor-fold>

    // <editor-fold desc="CLASSES">

    @JsonObject("PrimitivePropertyTest")
    class PrimitivePropertyTest {
        @JsonProperty("n", Number)
        n: number = 0;
        @JsonProperty("s", String)
        s: string = "";
        @JsonProperty("b", Boolean)
        b: boolean = false;
    }

    // </editor-fold>

    // <editor-fold desc="TESTS">

    describe("primitive property checks", () => {

        describe("serialize", () => {

            it("ignore primitives", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    // Good data
                    {
                        data: {n: 0, s: "A", b: true},
                        expected: {n: 0, s: "A", b: true},
                    },
                    {
                        data: {n: "0", s: 1, b: "true"},
                        expected: {n: "0", s: 1, b: "true"},
                    },
                    // Bad data (wrong dimension)
                    {
                        data: {n: {value: 0}, s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: [0], s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: {value: "A"}, b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: ["A"], b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: {value: true}},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: [true]},
                        throws: true,
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertIgnorePrimitives,
                        test.data,
                        PrimitivePropertyTest,
                        test.expected,
                        test.throws,
                    );
                }

            });

            it("check primitives", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    // Good data
                    {
                        data: {n: 0, s: "A", b: true},
                        expected: {n: 0, s: "A", b: true},
                    },
                    // Bad data (wrong primitive type)
                    {
                        data: {n: "0", s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: 0, b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: "true"},
                        throws: true,
                    },
                    // Bad data (wrong dimension)
                    {
                        data: {n: {value: 0}, s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: [0], s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: {value: "A"}, b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: ["A"], b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: {value: true}},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: [true]},
                        throws: true,
                    },
                ];

                for (const test of tests) {
                    serializeData(
                        jsonConvertCheckPrimitives,
                        test.data,
                        PrimitivePropertyTest,
                        test.expected,
                        test.throws,
                    );
                }

            });

        });

        describe("deserialize", () => {

            it("ignore primitives", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    // Good data
                    {
                        data: {n: 0, s: "A", b: true},
                        expected: {n: 0, s: "A", b: true},
                    },
                    {
                        data: {n: "0", s: 1, b: "true"},
                        expected: {n: "0", s: 1, b: "true"},
                    },
                    // Bad data (wrong dimension)
                    {
                        data: {n: {value: 0}, s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: [0], s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: {value: "A"}, b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: ["A"], b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: {value: true}},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: [true]},
                        throws: true,
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertIgnorePrimitives,
                        test.data,
                        PrimitivePropertyTest,
                        test.expected,
                        test.throws,
                    );
                }

            });

            it("check primitives", () => {

                const tests: { data: any, expected?: any, mapUndefinedToNull?: boolean, throws?: boolean }[] = [
                    // Good data
                    {
                        data: {n: 0, s: "A", b: true},
                        expected: {n: 0, s: "A", b: true},
                    },
                    // Bad data (wrong primitive type)
                    {
                        data: {n: "0", s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: 0, b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: "true"},
                        throws: true,
                    },
                    // Bad data (wrong dimension)
                    {
                        data: {n: {value: 0}, s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: [0], s: "A", b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: {value: "A"}, b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: ["A"], b: true},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: {value: true}},
                        throws: true,
                    },
                    {
                        data: {n: 0, s: "A", b: [true]},
                        throws: true,
                    },
                ];

                for (const test of tests) {
                    deserializeData(
                        jsonConvertCheckPrimitives,
                        test.data,
                        PrimitivePropertyTest,
                        test.expected,
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
                           throws: boolean = false): void {

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
                             throws: boolean = false): void {

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
