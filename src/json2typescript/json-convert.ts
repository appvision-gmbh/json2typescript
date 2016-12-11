/**
 * Offers a simple API for mapping json objects to TypeScript/JavaScript classes and vice versa.
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @version 0.9.5
 * @licence MIT
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export abstract class JsonConvert {

    /**
     * Helper class for value checking mode.
     */
    public static ValueCheckingMode = class {
        /**
         * Readonly flag for JsonConvert.ValueCheckingMode.valueChecking property.
         * All given values can be null.
         */
        public static readonly ALLOW_NULL: number = 1;
        /**
         * Readonly flag for JsonConvert.ValueCheckingMode.valueChecking property.
         * Objects can be null, but primitive types cannot be null.
         */
        public static readonly ALLOW_OBJECT_NULL: number = 2;
        /**
         * Readonly flag for JsonConvert.ValueCheckingMode.valueChecking property.
         * No null values are tolerated.
         */
        public static readonly DISALLOW_NULL: number = 3;
    }

    /**
     * Determines whether debugging info is shown in console.
     */
    public static debugMode: boolean = false;

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     */
    public static ignorePrimitiveChecks: boolean = false;

    /**
     * Determines which types are allowed to be null.
     * You may assign three different values:
     * JsonConvert.ValueCheckingMode.ALLOW_NULL: All given values can be null.
     * JsonConvert.ValueCheckingMode.ALLOW_OBJECT_NULL: Objects can be null, but primitive types cannot be null.
     * JsonConvert.ValueCheckingMode.DISALLOW_NULL: No null values are tolerated.
     */
    public static valueCheckingMode: number = JsonConvert.ValueCheckingMode.ALLOW_OBJECT_NULL;

    /**
     * Tries to serialize a JavaScript object to a JSON string.
     * @param instance any instance of a class
     * @returns {string} the JSON string
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    public static serializeObject(instance: Object): string {

        if (JsonConvert.debugMode) {
            console.log("----------");
            console.log("Receiving JavaScript object:");
            console.log(instance);
        }

        let jsonString: string = JSON.stringify(instance);

        if (JsonConvert.debugMode) {
            console.log("Returning JSON string:");
            console.log(jsonString);
            console.log("----------");
        }

        return jsonString;

    }

    /**
     * Tries to deserialize a JSON string to a TypeScript class.
     * @param jsonString the JSON string
     * @param classObject the object class
     * @returns {any} the deserialized object instance
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    public static deserializeString(jsonString: string, classObject: { new(): any }): any {

        if (typeof(jsonString) !== "string") {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not of type string."
            );
        }

        if (JsonConvert.debugMode) {
            console.log("Receiving JSON string:");
            console.log(jsonString);
        }

        // Create an object from json string
        let  jsonObject = JSON.parse(jsonString);

		
        return JsonConvert.deserializeObject(jsonObject, classObject);

    }

    /**
     * Tries to deserialize a JSON object to a TypeScript class.
     * @param jsonObject the JSON object
     * @param classObject the object class
     * @returns {any} the deserialized object instance
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    public static deserializeObject(jsonObject: any, classObject: { new(): any }): any {

        if (typeof(jsonObject) !== "object" || jsonObject instanceof Array) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object."
            );
        }

        if (JsonConvert.debugMode) {
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }

        let classInstance = new classObject();

        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(classInstance)) {
            JsonConvert.deserializeObject_loopProperty(classInstance, propertyKey, jsonObject);
        }

        if (JsonConvert.debugMode) {
            console.log("Returning CLASS instance:");
            console.log(classInstance);
        }

        return classInstance;

    }

    /**
     * Tries to deserialize a JSON array to a TypeScript class.
     * @param jsonArray the JSON array
     * @param classObject the object class
     * @returns {any[]} the deserialized array of object instances
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    public static deserializeArray(jsonArray: any[], classObject: { new(): any }): any[] {

        if (typeof(jsonArray) !== "object" || jsonArray instanceof Array === false) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array object."
            );
        }

        if (JsonConvert.debugMode) {
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }

        let array: any[] = [];

        // Loop through all array elements
        for (const jsonObject of jsonArray) {
            array.push(JsonConvert.deserializeObject(jsonObject, classObject));
        }

        if (JsonConvert.debugMode) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
        }

        return array;

    }

    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     * @param classInstance the instance of the class
     * @param propertyKey the property
     * @param json the JSON object
     * @throws throws an expection in case of failure
     */
    private static deserializeObject_loopProperty(classInstance: any, propertyKey: string, json: Object): void {

        // Get the mapping array
        let mapping = classInstance["__jsonconvert__mapping__"];


        // Check if a object-JSON mapping is possible for a property
        if (JsonConvert.deserializeObject_propertyHasDecorator(mapping, propertyKey) === false) {

            // Make sure values are not overridden by undefined json values
            if (typeof(json[propertyKey]) !== "undefined")
                classInstance[propertyKey] = json[propertyKey];

            return;

        }


        // Get expected and real values
        let jsonKey: string = mapping[propertyKey]["jsonKey"];
        let expectedType: any = mapping[propertyKey]["type"];
        let isOptional: boolean = mapping[propertyKey]["optional"];

        let jsonValue: any = json[jsonKey];


        // Check if the json value exists
        if (typeof(jsonValue) === "undefined") {

            if (isOptional) return;

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + classInstance.constructor.name + "\" because the defined JSON property \"" + jsonKey + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey
            );
        }


        // Map the property
        try {
            classInstance[propertyKey] = JsonConvert.deserializeObject_mapProperty(expectedType, jsonValue);
        } catch(e) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + classInstance.constructor.name + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tExpected type: \n\t\t" + JsonConvert.deserializeObject_getExpectedType(expectedType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                "\tJSON type: \n\t\t" + JsonConvert.deserializeObject_getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message
            );
        }
    }

    /**
     * Check if a class property has a decorator.
     * @param mapping the class-JSON mapping array
     * @param propertyKey the property key
     * @returns {boolean} true if the mapping exists, otherwise false
     */
    private static deserializeObject_propertyHasDecorator(mapping: any, propertyKey: string): boolean {
        return typeof(mapping) !== "undefined" && typeof(mapping[propertyKey]) !== "undefined";
    }

    /**
     * Tries to map a JSON property to a class property.
     * Checks the type of the JSON value and compares it to the expected value.
     * @param expectedType the expected type for the property indicated in the decorator
     * @param jsonValue the JSON object for the given property
     * @returns returns the resulted mapped property
     * @throws throws an expection in case of failure
     */
    private static deserializeObject_mapProperty(expectedType: any, jsonValue: any): any {

        // Map immediately if we don't care about the type
        if (typeof(expectedType) === "undefined" || expectedType === null || expectedType === Object) {
            return jsonValue;
        }

        // Check if attempt and expected was 1-d
        if (expectedType instanceof Array === false && jsonValue instanceof Array === false) {

            // Check the type
            if (expectedType.hasOwnProperty("__jsonconvert__mapping__")) { // only decorated custom objects have this injected property

                // Check if we have null value
                if (jsonValue === null) {
                    if (JsonConvert.valueCheckingMode !== JsonConvert.ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: JSON value is null.");
                }

                return JsonConvert.deserializeObject(jsonValue, expectedType);

            } else if (expectedType === null || expectedType === Object || expectedType === undefined) { // general object

                // Check if we have null value
                if (jsonValue === null) {
                    if (JsonConvert.valueCheckingMode !== JsonConvert.ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: JSON value is null.");
                }

                return jsonValue;

            } else if (expectedType === String || expectedType === Number || expectedType === Boolean) { // otherwise check for a primitive type

                // Check if we have null value
                if (jsonValue === null) {
                    if (JsonConvert.valueCheckingMode === JsonConvert.ValueCheckingMode.ALLOW_NULL) return null;
                    else throw new Error("\tReason: JSON value is null.");
                }

                // Check if the types match
                if ( // primitive types match
                (expectedType === String && typeof(jsonValue) === "string") ||
                (expectedType === Number && typeof(jsonValue) === "number") ||
                (expectedType === Boolean && typeof(jsonValue) === "boolean")
                ) {
                    return jsonValue;
                } else { // primitive types mismatch
                    if (JsonConvert.ignorePrimitiveChecks) return jsonValue;
                    throw new Error("\tReason: JSON object does not match the expected primitive type.");
                }

            } else { // other weird types

                throw new Error("\tReason: Expected type is unknown.");

            }

        }

        // Check if attempt and expected was n-d
        if (expectedType instanceof Array && jsonValue instanceof Array) {

            let array = [];

            // No data given, so return empty value
            if (jsonValue.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the json value as is
            if (expectedType.length === 0) {
                return jsonValue;
            }

            // Loop through the data. Both expectedType and jsonValue are at least of length 1
            let autofillType: boolean = expectedType.length < jsonValue.length;
            for (let i = 0; i < jsonValue.length; i++) {

                if (autofillType && i >= expectedType.length) expectedType[i] = expectedType[i-1];

                array[i] = JsonConvert.deserializeObject_mapProperty(expectedType[i], jsonValue[i]);

            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedType instanceof Array && jsonValue instanceof Object) {

            let array = [];

            // No data given, so return empty value
            if (jsonValue.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the json value as is
            if (expectedType.length === 0) {
                return jsonValue;
            }

            // Loop through the data. Both expectedType and jsonValue are at least of length 1
            let autofillType: boolean = expectedType.length < Object.keys(jsonValue).length;
            let i = 0;
            for (let key in jsonValue) {

                if (autofillType && i >= expectedType.length) expectedType[i] = expectedType[i-1];

                array[key] = JsonConvert.deserializeObject_mapProperty(expectedType[i], jsonValue[key]);

                i++;
            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedType instanceof Array) {
            if (jsonValue === null) {
                if (JsonConvert.valueCheckingMode !== JsonConvert.ValueCheckingMode.DISALLOW_NULL) return null;
                else throw new Error("\tReason: JSON value is null.");
            }
            throw new Error("\tReason: Expected type is array, but JSON value is non-array.");
        }

        // Check if attempt was n-d and expected as 1-d
        if (jsonValue instanceof Array) {
            throw new Error("\tReason: JSON value is array, but expected a non-array type.");
        }

        // All other attempts are fatal
        throw new Error(
            "\tReason: Mapping failed because of an unknown error."
        );

    }

    /**
     * Returns a string representation of the expected type.
     * @param expectedType the expected type given from the decorator
     * @returns {string} the string representation
     */
    private static deserializeObject_getExpectedType(expectedType: any): string {

        let type: string = "";

        if (expectedType instanceof Array) {
            type = "[";
            for (let i = 0; i < expectedType.length; i++) {
                if (i > 0) type += ",";
                type += JsonConvert.deserializeObject_getExpectedType(expectedType[i]);
            }
            type += "]";
            return type;
        } else {
            if (expectedType === undefined || expectedType === null || expectedType === Object) {
                return "any";
            } else if (expectedType === String || expectedType == Boolean || expectedType == Number) {
                return (new expectedType()).constructor.name.toLowerCase();
            } else if (typeof expectedType === 'function') {
                return (new expectedType()).constructor.name;
            } else {
                return "?????";
            }
        }

    }

    /**
     * Returns a string representation of the JSON value.
     * @param jsonValue the JSON value
     * @returns {string} the string representation
     */
    private static deserializeObject_getJsonType(jsonValue: any): string {

        if (jsonValue === null) return "null";

        let type: string = "";

        if (jsonValue instanceof Array) {
            type = "[";
            for (let i = 0; i < jsonValue.length; i++) {
                if (i > 0) type += ",";
                type += JsonConvert.deserializeObject_getJsonType(jsonValue[i]);
            }
            type += "]";
            return type;
        } else {
            return typeof(jsonValue);
        }

    }

}

/**
 * Decorator of a class that comes from a JSON object.
 * @param target the class
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export function JsonObject(target: any) {
    target["__jsonconvert__mapping__"] = [];
}

/**
 * Decorator of a class property that comes from a JSON object.
 * Use the following notation for the type:
 * Primitive type: String|Number|Boolean
 * Custom type: YourClassName
 * Array type: [String|Number|Boolean|YourClassName]
 * @param jsonKey the key in the expected JSON object
 * @param expectedType optional param (default: undefined), the expected type String|Boolean|Number|any
 * @param isOptional optional param (default: false), if true, the property does not have to be present in the json object
 * @see https://www.npmjs.com/package/json2typescript full documentation
 * @returns {(target:any, key:string)=>void}
 */
export function JsonProperty(jsonKey: string, expectedType?: any, isOptional?: boolean): any {

    return function (target: any, key: string): void {

        if (typeof(target["__jsonconvert__mapping__"]) === "undefined") {
            target["__jsonconvert__mapping__"] = [];
        }

        if (typeof(isOptional) === "undefined") {
            isOptional = false;
        }

        target["__jsonconvert__mapping__"][key] = {
            "jsonKey": jsonKey,
            "type": expectedType,
            "optional": isOptional
        };

    }

}