/**
 * Offers a simple API for mapping JSON objects to TypeScript/JavaScript classes and vice versa.
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export class JsonConvert {

    ////////////////
    // PROPERTIES //
    ////////////////


    /**
     * Determines how the JsonConvert class instance should operate.
     *
     * You may assign three different values:
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking is done
     * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
     * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
     */
    private _operationMode: number = OperationMode.ENABLE;

    /**
     * Determines how the JsonConvert class instance should operate.
     *
     * You may assign three different values:
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking is done
     * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
     * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
     * @returns {number}
     */
    get operationMode(): number {
        return this._operationMode;
    }

    /**
     * Determines how the JsonConvert class instance should operate.
     *
     * You may assign three different values:
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking is done
     * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
     * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
     * @param value
     */
    set operationMode(value: number) {
        if (value in OperationMode) this._operationMode = value;
    }

    /**
     * Determines which types are allowed to be null.
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
     */
    private _valueCheckingMode: number = ValueCheckingMode.ALLOW_OBJECT_NULL;

    /**
     * Determines which types are allowed to be null.
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
     * @returns {number}
     */
    get valueCheckingMode(): number {
        return this._valueCheckingMode;
    }

    /**
     * Determines which types are allowed to be null.
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
     * @param value
     */
    set valueCheckingMode(value: number) {
        if (value in ValueCheckingMode) this._valueCheckingMode = value;
    }

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     */
    private _ignorePrimitiveChecks: boolean = false;

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     * @returns {boolean}
     */
    get ignorePrimitiveChecks(): boolean {
        return this._ignorePrimitiveChecks;
    }

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     * @param value
     */
    set ignorePrimitiveChecks(value: boolean) {
        this._ignorePrimitiveChecks = value;
    }


    /////////////////
    // CONSTRUCTOR //
    /////////////////


    /**
     * Constructor.
     *
     * Check the equally named class properties to learn more about the meaning of the params.
     * @param operationMode optional param (default: OperationMode.ENABLE)
     * @param valueCheckingMode optional param (default: ValueCheckingMode.ALLOW_OBJECT_NULL)
     * @param ignorePrimitiveChecks optional param (default: false)
     */
    construct(operationMode?: number, valueCheckingMode?: number, ignorePrimitiveChecks?: boolean) {
        if (operationMode in OperationMode) this.operationMode = operationMode;
        if (valueCheckingMode in ValueCheckingMode) this.valueCheckingMode = valueCheckingMode;
        if (ignorePrimitiveChecks) this.ignorePrimitiveChecks = ignorePrimitiveChecks;
    }


    ////////////////////
    // PUBLIC METHODS //
    ////////////////////


    /**
     * Tries to serialize a JavaScript object to a JSON string.
     * @param instance any instance of a class
     * @returns {string} the JSON string
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeObject(instance: Object): string {

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript object:");
            console.log(instance);
        }

        let jsonString: string = JSON.stringify(instance);

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning JSON string:");
            console.log(jsonString);
            console.log("----------");
        }

        return jsonString;

    }

    /**
     * Tries to deserialize given data to a TypeScript class.
     * @param json the JSON as string, object or array
     * @param classObject the object class
     * @returns {any} the deserialized data (object instance or array of object instances)
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserialize(json: any, classObject: { new(): any }): any {

        if (typeof json === "string") return this.deserializeString(json, classObject);
        if (json.constructor === Array) return this.deserializeArray(json, classObject);
        if (typeof json === "object") return this.deserializeObject(json, classObject); // must be last due to the fact that an array is an object in TypeScript!

        throw new Error(
            "Fatal error in JsonConvert. " +
            "Passed parameter json in JsonConvert.deserialize() is not a valid json format (string, object or array)."
        );

    };

    /**
     * Tries to deserialize a JSON string to a TypeScript class.
     * @param jsonString the JSON string
     * @param classObject the object class
     * @returns {any} the deserialized object instance
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeString(jsonString: string, classObject: { new(): any }): any {

        if (typeof(jsonString) !== "string") {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not of type string."
            );
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Receiving JSON string:");
            console.log(jsonString);
        }

        // Create an object from json string
        let jsonData = JSON.parse(jsonString);

        if (typeof(jsonData) === 'object') {
            if (jsonData instanceof Array) {
                return this.deserializeArray(jsonData, classObject);
            } else {
                return this.deserializeObject(jsonData, classObject);
            }
        } else {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonString in JsonConvert.deserializeString() is not a valid json string."
            );
        }
    }

    /**
     * Tries to deserialize a JSON object to a TypeScript class.
     * @param jsonObject the JSON object
     * @param classObject the object class
     * @returns {any} the deserialized object instance
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeObject(jsonObject: any, classObject: { new(): any }): any {

        if (typeof(jsonObject) !== "object" || jsonObject instanceof Array) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object."
            );
        }

        if (this.operationMode === OperationMode.DISABLE) {
            return jsonObject;
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }

        let classInstance = new classObject();

        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(classInstance)) {
            this.deserializeObject_loopProperty(classInstance, propertyKey, jsonObject);
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning CLASS instance:");
            console.log(classInstance);
        }

        return classInstance;

    }

    /**
     * Tries to deserialize a JSON array to a TypeScript class array.
     * @param jsonArray the JSON array
     * @param classObject the object class
     * @returns {any[]} the deserialized array of object instances
     * @throws an exception in case of failure
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeArray(jsonArray: any[], classObject: { new(): any }): any[] {

        if (typeof(jsonArray) !== "object" || jsonArray instanceof Array === false) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array."
            );
        }

        if (this.operationMode === OperationMode.DISABLE) {
            return jsonArray;
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }

        let array: any[] = [];

        // Loop through all array elements
        for (const jsonObject of jsonArray) {
            array.push(this.deserializeObject(jsonObject, classObject));
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
        }

        return array;

    }


    /////////////////////
    // PRIVATE METHODS //
    /////////////////////


    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     * @param classInstance the instance of the class
     * @param propertyKey the property
     * @param json the JSON object
     * @throws throws an expection in case of failure
     */
    private deserializeObject_loopProperty(classInstance: any, propertyKey: string, json: Object): void {

        // Get the mapping array
        let mapping = classInstance["__jsonconvert__mapping__"];


        // Check if a object-JSON mapping is possible for a property
        if (this.deserializeObject_propertyHasDecorator(mapping, propertyKey) === false) {

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
            classInstance[propertyKey] = this.deserializeObject_mapProperty(expectedType, jsonValue);
        } catch (e) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + classInstance.constructor.name + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tExpected type: \n\t\t" + this.deserializeObject_getExpectedType(expectedType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                "\tJSON type: \n\t\t" + this.deserializeObject_getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message + "\n"
            );
        }
    }

    /**
     * Check if a class property has a decorator.
     * @param mapping the class-JSON mapping array
     * @param propertyKey the property key
     * @returns {boolean} true if the mapping exists, otherwise false
     */
    private deserializeObject_propertyHasDecorator(mapping: any, propertyKey: string): boolean {
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
    private deserializeObject_mapProperty(expectedType: any, jsonValue: any): any {

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
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: JSON value is null.");
                }

                return this.deserializeObject(jsonValue, expectedType);

            } else if (expectedType === null || expectedType === Object || expectedType === undefined) { // general object

                // Check if we have null value
                if (jsonValue === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: JSON value is null.");
                }

                return jsonValue;

            } else if (expectedType === String || expectedType === Number || expectedType === Boolean) { // otherwise check for a primitive type

                // Check if we have null value
                if (jsonValue === null) {
                    if (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL) return null;
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
                    if (this.ignorePrimitiveChecks) return jsonValue;
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

                if (autofillType && i >= expectedType.length) expectedType[i] = expectedType[i - 1];

                array[i] = this.deserializeObject_mapProperty(expectedType[i], jsonValue[i]);

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

                if (autofillType && i >= expectedType.length) expectedType[i] = expectedType[i - 1];

                array[key] = this.deserializeObject_mapProperty(expectedType[i], jsonValue[key]);

                i++;
            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedType instanceof Array) {
            if (jsonValue === null) {
                if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) return null;
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
    private deserializeObject_getExpectedType(expectedType: any): string {

        let type: string = "";

        if (expectedType instanceof Array) {
            type = "[";
            for (let i = 0; i < expectedType.length; i++) {
                if (i > 0) type += ",";
                type += this.deserializeObject_getExpectedType(expectedType[i]);
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
    private deserializeObject_getJsonType(jsonValue: any): string {

        if (jsonValue === null) return "null";

        let type: string = "";

        if (jsonValue instanceof Array) {
            type = "[";
            for (let i = 0; i < jsonValue.length; i++) {
                if (i > 0) type += ",";
                type += this.deserializeObject_getJsonType(jsonValue[i]);
            }
            type += "]";
            return type;
        } else {
            return typeof(jsonValue);
        }

    }

}

/**
 * Enum for the operation mode of a JsonConvert class instance.
 *
 * The values should be used as follows:
 * - DISABLE: json2typescript will be disabled, no type checking is done
 * - ENABLE: json2typescript is enabled, but only errors are logged
 * - LOGGING: json2typescript is enabled and detailed information is logged
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export enum OperationMode {
    DISABLE = 0,
    ENABLE = 1,
    LOGGING = 2
};

/**
 * Enum for the value checking mode of a JsonConvert class instance.
 *
 * The values should be used as follows:
 * - ALLOW_NULL: all given values in the JSON are allowed to be null
 * - ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
 * - DISALLOW_NULL: no null values are tolerated in the JSON
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
 */
export enum ValueCheckingMode {
    ALLOW_NULL = 1,
    ALLOW_OBJECT_NULL = 2,
    DISALLOW_NULL = 3
};

/**
 * Decorator of a class that comes from a JSON object.
 * @param target the class
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
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
 * @returns {(target:any, key:string)=>void}
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation
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