/**
 * Offers a simple API for mapping json objects to TypeScript/JavaScript classes and vice versa.
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @version 0.9.1
 * @licence MIT
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export abstract class JsonConvert {

    /**
     * Determines whether debugging info is shown in console.
     */
    public static debug: boolean = false;

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     */
    public static ignorePrimitiveChecks: boolean = false;

    /**
     * Determines whether all types (also primitives) are allowed to be null.
     * If false, only custom non-primitive types are allowed to be null.
     */
    public static allowPrimitiveNull: boolean = false;

    /**
     * Tries to serialize a JavaScript object to a json string.
     * @param instance any instance of a class
     * @returns {string} the json string
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    public static serializeObject(instance: Object): string {

        if (JsonConvert.debug) {
            console.log("----------");
            console.log("Receiving JavaScript object:");
            console.log(instance);
        }

        let jsonString: string = JSON.stringify(instance);

        if (JsonConvert.debug) {
            console.log("Returning JSON string:");
            console.log(jsonString);
            console.log("----------");
        }

        return jsonString;

    }

    /**
     * Tries to deserialize a json object to a JavaScript class.
     * @param json the json object or string
     * @param classObject the class object
     * @returns the deserialized object
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    public static deserializeObject(json: any, classObject: { new(): any }): any {

        // Create an object from json string if necessary
        let jsonObject: Object;
        if (typeof(json) === "string") jsonObject = JSON.parse(json);
        else jsonObject = json;

        if (JsonConvert.debug) {
            console.log("----------");
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }

        let classInstance = new classObject();

        // Loop through all (not undefined) class properties
        for (const propertyKey of Object.keys(classInstance)) {
            JsonConvert.deserializeObject_loopProperty(classInstance, propertyKey, jsonObject);
        }

        if (JsonConvert.debug) {
            console.log("Returning CLASS instance:");
            console.log(classInstance);
            console.log("----------");
        }

        return classInstance;
    }

    /**
     * Tries to deserialize a json object property to a JavaScript class.
     * @param classInstance the instance of the class
     * @param propertyKey the property
     * @param json the json object
     */
    private static deserializeObject_loopProperty(classInstance: any, propertyKey: string, json: Object): void {

        // Get the mapping array
        let mapping = classInstance["__jsonconvert__mapping__"];


        // Check if a object-json mapping is possible for a property
        if (JsonConvert.deserializeObject_propertyHasDecorator(mapping, propertyKey) === false) {
            classInstance[propertyKey] = json[propertyKey];
            return;
        }


        // Get expected and real values
        let jsonKey: string = mapping[propertyKey]["jsonKey"];
        let expectedType: any = mapping[propertyKey]["type"];

        let jsonValue: any = json[jsonKey];


        // Check if the json value exists
        if (typeof(jsonValue) === "undefined") {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the json object to the class \"" + classInstance.constructor.name + "\" because the defined json property \"" + jsonKey + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tJson property: \n\t\t" + jsonKey
            );
        }


        // Map the property
        try {
            classInstance[propertyKey] = JsonConvert.deserializeObject_mapProperty(expectedType, jsonValue);
        } catch(e) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the json object to the class \"" + classInstance.constructor.name + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tExpected type: \n\t\t" + JsonConvert.deserializeObject_getExpectedType(expectedType) + "\n\n" +
                "\tJson property: \n\t\t" + jsonKey + "\n\n" +
                "\tJson type: \n\t\t" + JsonConvert.deserializeObject_getJsonType(jsonValue) + "\n\n" +
                "\tJson value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message
            );
        }
    }

    /**
     * Check if a class property has a decorator.
     * @param mapping the class-json mapping array
     * @param propertyKey the property key
     * @returns {boolean} true if the mapping exists, otherwise false
     */
    private static deserializeObject_propertyHasDecorator(mapping: any, propertyKey: string): boolean {
        return typeof(mapping) !== "undefined" && typeof(mapping[propertyKey]) !== "undefined";
    }

    /**
     * Tries to map a json property to a class property.
     * Checks the type of the json value and compares it to the expected value.
     * @param expectedType the expected type for the property indicated in the decorator
     * @param jsonValue the json object for the given property
     * @returns returns the resulted mapped property
     * @throws throws an expection in case of failure
     */
    private static deserializeObject_mapProperty(expectedType: any, jsonValue: any): any {

        // Map immediately if we don't care about the type
        if (typeof(expectedType) === "undefined" || expectedType === null || expectedType === Object) {
            return jsonValue;
        }

        // Check if it the attempt was 1-d
        if (expectedType instanceof Array === false && jsonValue instanceof Array === false) {

            // Check the type
            if (expectedType.hasOwnProperty("__jsonconvert__mapping__")) { // only decorated custom objects have this injected property

                // Check if we have null value
                if (jsonValue === null) return null;

                return JsonConvert.deserializeObject(jsonValue, expectedType);

            } else if (expectedType === Object || expectedType === undefined) { // general object

                // Check if we have null value
                if (jsonValue === null) return null;

                return jsonValue;

            } else if (expectedType === String || expectedType === Number || expectedType === Boolean) { // otherwise check for a primitive type

                // Check if we have null value
                if (JsonConvert.allowPrimitiveNull && jsonValue === null) return null;
                else if (jsonValue === null) throw new Error("\tReason: Primitive type mapping failed because the json value was null.");

                // Check if the types match
                if ( // primitive types match
                (expectedType === String && typeof(jsonValue) === "string") ||
                (expectedType === Number && typeof(jsonValue) === "number") ||
                (expectedType === Boolean && typeof(jsonValue) === "boolean")
                ) {
                    return jsonValue;
                } else { // primitive types mismatch
                    if (JsonConvert.ignorePrimitiveChecks) return jsonValue;
                    throw new Error("\tReason: Primitive type mapping failed because the type from the json object does not match the expected type.");
                }

            } else { // other weird types

                throw new Error("\tReason: Primitive type mapping failed because the provided type is unknown.");

            }

        }

        // Check if it the attempt was n-d
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

        // All other attempts are fatal
        throw new Error(
            "\tReason: Array mapping failed because the array type from the json object does not match the expected array type."
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
     * Returns a string representation of the json value.
     * @param jsonValue the json value
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
 * Decorator of a class that comes from a json object.
 * @param target the class
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export function JsonObject(target: any) {
    target["__jsonconvert__mapping__"] = [];
}

/**
 * Decorator of a class property that comes from a json object.
 * Use the following notation for the type:
 * Primitive type: String|Number|Boolean
 * Custom type: YourClassName
 * Array type: [String|Numer|Boolean|YourClassName]
 * @param jsonKey the key in the expected json object
 * @param type the expected type String|Boolean|Number|any
 * @see https://www.npmjs.com/package/json2typescript full documentation
 * @returns {(target:any, key:string)=>void}
 */
export function JsonProperty(jsonKey: string, type?: any): any {

    return function (target: any, key: string): void {

        if (typeof(target["__jsonconvert__mapping__"]) === "undefined") {
            target["__jsonconvert__mapping__"] = [];
        }

        target["__jsonconvert__mapping__"][key] = {
            "jsonKey": jsonKey,
            "type": type
        };

    }
}