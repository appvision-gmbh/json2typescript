import { OperationMode, ValueCheckingMode } from "./json-convert-enums";
import { MappingOptions, Settings } from "./json-convert-options";

/**
 * Offers a simple API for mapping JSON objects to TypeScript/JavaScript classes and vice versa.
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation on NPM
 */
export class JsonConvert {

    ////////////////
    // PROPERTIES //
    ////////////////


    /**
     * Determines how the JsonConvert class instance should operate.
     *
     * You may assign three different values:
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
     * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
     * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
     */
    private _operationMode: number = OperationMode.ENABLE;

    /**
     * Determines how the JsonConvert class instance should operate.
     *
     * You may assign three different values:
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
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
     * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
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
     *
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
     *
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
     *
     * @returns {boolean}
     */
    get ignorePrimitiveChecks(): boolean {
        return this._ignorePrimitiveChecks;
    }

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     *
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
     * To learn more about the params, check the documentation of the equally named class properties.
     *
     * @param operationMode optional param (default: OperationMode.ENABLE)
     * @param valueCheckingMode optional param (default: ValueCheckingMode.ALLOW_OBJECT_NULL)
     * @param ignorePrimitiveChecks optional param (default: false)
     */
    constructor(operationMode?: number, valueCheckingMode?: number, ignorePrimitiveChecks?: boolean) {
        if (operationMode in OperationMode) this.operationMode = operationMode;
        if (valueCheckingMode in ValueCheckingMode) this.valueCheckingMode = valueCheckingMode;
        if (ignorePrimitiveChecks) this.ignorePrimitiveChecks = ignorePrimitiveChecks;
    }


    ////////////////////
    // PUBLIC METHODS //
    ////////////////////


    /**
     * Tries to serialize a TypeScript object or array of objects to JSON.
     *
     * @param data object or array of objects
     *
     * @returns {any} the JSON object
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serialize(data: any): any {

        if (data.constructor === Array) return this.serializeArray(data);
        if (typeof data === "object") return this.serializeObject(data); // must be last due to the fact that an array is an object in TypeScript!

        throw new Error(
            "Fatal error in JsonConvert. " +
            "Passed parameter json in JsonConvert.serialize() is not in valid format (object or array)."
        );

    }

    /**
     * Tries to serialize a TypeScript object to a JSON object.
     *
     * @param instance TypeScript instance
     *
     * @returns {any} the JSON object
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeObject(instance: object): object {

        if (typeof(instance) !== "object" || instance instanceof Array) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.serializeObject() is not of type object."
            );
        }

        if (this.operationMode === OperationMode.DISABLE) {
            return instance;
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript instance:");
            console.log(instance);
        }

        let jsonObject: any = {};

        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(instance)) {
            this.serializeObject_loopProperty(instance, propertyKey, jsonObject);
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning JSON object:");
            console.log(jsonObject);
            console.log("----------");
        }

        return jsonObject;
    }

    /**
     * Tries to serialize a TypeScript array to a JSON array.
     *
     * @param instanceArray array of TypeScript instances
     *
     * @returns {any[]} the JSON array
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeArray(instanceArray: object[]): object[] {

        if (typeof(instanceArray) !== "object" || instanceArray instanceof Array === false) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.serializeArray() is not of type array."
            );
        }

        if (this.operationMode === OperationMode.DISABLE) {
            return instanceArray;
        }
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript array:");
            console.log(instanceArray);
        }

        let jsonArray: any[] = [];

        // Loop through all array elements
        for (const classInstance of instanceArray) {
            jsonArray.push(this.serializeObject(classInstance));
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning JSON array:");
            console.log(jsonArray);
            console.log("----------");
        }

        return jsonArray;

    }

    /**
     * Tries to deserialize given JSON to a TypeScript object or array of objects.
     *
     * @param json the JSON as object or array
     * @param classReference the class reference
     *
     * @returns {any} the deserialized data (TypeScript instance or array of TypeScript instances)
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserialize(json: any, classReference: { new(): any }): any {

        if (json.constructor === Array) return this.deserializeArray(json, classReference);
        if (typeof json === "object") return this.deserializeObject(json, classReference); // must be last due to the fact that an array is an object in TypeScript!

        throw new Error(
            "Fatal error in JsonConvert. " +
            "Passed parameter json in JsonConvert.deserialize() is not in valid json format (object or array)."
        );

    };

    /**
     * Tries to deserialize a JSON object to a TypeScript object.
     *
     * @param jsonObject the JSON object
     * @param classReference the class reference
     *
     * @returns {any} the deserialized TypeScript instance
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeObject(jsonObject: object, classReference: { new(): any }): object {

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
            console.log("----------");
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }

        let classInstance = new classReference();

        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(classInstance)) {
            this.deserializeObject_loopProperty(classInstance, propertyKey, jsonObject);
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning CLASS instance:");
            console.log(classInstance);
            console.log("----------");
        }

        return classInstance;

    }

    /**
     * Tries to deserialize a JSON array to a TypeScript array.
     *
     * @param jsonArray the JSON array
     * @param classReference the object class
     *
     * @returns {any[]} the deserialized array of TypeScript instances
     *
     * @throws an exception in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeArray(jsonArray: object[], classReference: { new(): any }): object[] {

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
            console.log("----------");
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }

        let array: any[] = [];

        // Loop through all array elements
        for (const jsonObject of jsonArray) {
            array.push(this.deserializeObject(jsonObject, classReference));
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
            console.log("----------");
        }

        return array;

    }


    /////////////////////
    // PRIVATE METHODS //
    /////////////////////


    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param propertyKey the property
     * @param json the JSON object
     *
     * @throws throws an expection in case of failure
     */
    private serializeObject_loopProperty(instance: object, propertyKey: string, json: Object): void {

        // Get the mapping array
        let mapping = instance[Settings.MAPPING_PROPERTY];


        // Check if a JSON-object mapping is possible for a property
        if (this.classPropertyHasDecorator(mapping, propertyKey) === false) {
            return;
        }


        // Get expected and real values
        let jsonPropertyMappingOptions: MappingOptions = mapping[propertyKey];
        let jsonKey: string = jsonPropertyMappingOptions.jsonProperty;
        let expectedType: any = jsonPropertyMappingOptions.expectedType;
        let isOptional: boolean = jsonPropertyMappingOptions.isOptional;
        let customConverter: any = jsonPropertyMappingOptions.customConverter;

        let classInstancePropertyValue: any = instance[propertyKey];


        // Check if the json value exists
        if (typeof(classInstancePropertyValue) === "undefined") {

            if (isOptional) return;

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance.constructor["name"] + "\" to JSON because the defined class property \"" + propertyKey + "\" does not exist or is not defined:\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n"
            );
        }


        // Map the property
        try {
            json[jsonKey] = customConverter !== null ? customConverter.serialize(classInstancePropertyValue) : this.verifyProperty(expectedType, classInstancePropertyValue, true);
        } catch (e) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance.constructor["name"] + "\" to JSON because of a type error.\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tClass property value: \n\t\t" + classInstancePropertyValue + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedType) + "\n\n" +
                "\tRuntime type: \n\t\t" + this.getTrueType(classInstancePropertyValue) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                e.message + "\n"
            );
        }
    }

    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param propertyKey the property
     * @param json the JSON object
     *
     * @throws throws an expection in case of failure
     */
    private deserializeObject_loopProperty(instance: object, propertyKey: string, json: Object): void {

        // Get the mapping array
        let mapping = instance[Settings.MAPPING_PROPERTY];


        // Check if a object-JSON mapping is possible for a property
        if (this.classPropertyHasDecorator(mapping, propertyKey) === false) {

            // Make sure values are not overridden by undefined json values
            if (typeof(json[propertyKey]) !== "undefined")
                instance[propertyKey] = json[propertyKey];

            return;

        }


        // Get expected and real values
        let jsonPropertyMappingOptions: MappingOptions = mapping[propertyKey];
        let jsonKey: string = jsonPropertyMappingOptions.jsonProperty;
        let expectedType: any = jsonPropertyMappingOptions.expectedType;
        let isOptional: boolean = jsonPropertyMappingOptions.isOptional;
        let customConverter: any = jsonPropertyMappingOptions.customConverter;

        let jsonValue: any = json[jsonKey];


        // Check if the json value exists
        if (typeof(jsonValue) === "undefined") {

            if (isOptional) return;

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + instance.constructor["name"] + "\" because the defined JSON property \"" + jsonKey + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n"
            );
        }


        // Map the property
        try {
            instance[propertyKey] = customConverter !== null ? customConverter.deserialize(jsonValue) : this.verifyProperty(expectedType, jsonValue);
        } catch (e) {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + instance.constructor["name"]+ "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + propertyKey + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonKey + "\n\n" +
                "\tJSON type: \n\t\t" + this.getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message + "\n"
            );
        }
    }


    ////////////////////
    // HELPER METHODS //
    ////////////////////


    /**
     * Check if a class property has a decorator.
     *
     * @param mapping the class-JSON mapping array
     * @param propertyName the property key
     *
     * @returns {boolean} true if the mapping exists, otherwise false
     */
    private classPropertyHasDecorator(mapping: any, propertyName: string): boolean {
        return typeof(mapping) !== "undefined" && typeof(mapping[propertyName]) !== "undefined";
    }

    /**
     * Compares the type of a given value with an internal expected type.
     * Either returns the resulting value or throws an exception.
     *
     * @param expectedType the expected type for the property
     * @param value the property value to verify
     * @param serialize optional param (default: false), if given, we are in serialization mode
     *
     * @returns returns the resulted mapped property
     *
     * @throws throws an expection in case of failure
     */
    private verifyProperty(expectedType: any, value: any, serialize?: boolean): any {

        // Map immediately if we don't care about the type
        if (typeof(expectedType) === "undefined" || expectedType === null || expectedType === Object) {
            return value;
        }

        // Check if attempt and expected was 1-d
        if (expectedType instanceof Array === false && value instanceof Array === false) {

            // Check the type
            if (expectedType.hasOwnProperty(Settings.MAPPING_PROPERTY)) { // only decorated custom objects have this injected property

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: Given value is null.");
                }

                if (serialize) return this.serializeObject(value);
                else return this.deserializeObject(value, expectedType);

            } else if (expectedType === null || expectedType === Object || expectedType === undefined) { // general object

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: Given value is null.");
                }

                return value;

            } else if (expectedType === String || expectedType === Number || expectedType === Boolean) { // otherwise check for a primitive type

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL) return null;
                    else throw new Error("\tReason: Given value is null.");
                }

                // Check if the types match
                if ( // primitive types match
                (expectedType === String && typeof(value) === "string") ||
                (expectedType === Number && typeof(value) === "number") ||
                (expectedType === Boolean && typeof(value) === "boolean")
                ) {
                    return value;
                } else { // primitive types mismatch
                    if (this.ignorePrimitiveChecks) return value;
                    throw new Error("\tReason: Given object does not match the expected primitive type.");
                }

            } else { // other weird types

                throw new Error("\tReason: Expected type is unknown. You are either missing the decorator @JsonObject (for object mapping) or @JsonConverter (for custom mapping) before your class definition.");

            }

        }

        // Check if attempt and expected was n-d
        if (expectedType instanceof Array && value instanceof Array) {

            let array = [];

            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the value as is
            if (expectedType.length === 0) {
                return value;
            }

            // Loop through the data. Both type and value are at least of length 1
            let autofillType: boolean = expectedType.length < value.length;
            for (let i = 0; i < value.length; i++) {

                if (autofillType && i >= expectedType.length) expectedType[i] = expectedType[i - 1];

                array[i] = this.verifyProperty(expectedType[i], value[i]);

            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedType instanceof Array && value instanceof Object) {

            let array = [];

            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the json value as is
            if (expectedType.length === 0) {
                return value;
            }

            // Loop through the data. Both type and value are at least of length 1
            let autofillType: boolean = expectedType.length < Object.keys(value).length;
            let i = 0;
            for (let key in value) {

                if (autofillType && i >= expectedType.length) expectedType[i] = expectedType[i - 1];

                array[key] = this.verifyProperty(expectedType[i], value[key]);

                i++;
            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedType instanceof Array) {
            if (value === null) {
                if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) return null;
                else throw new Error("\tReason: Given value is null.");
            }
            throw new Error("\tReason: Expected type is array, but given value is non-array.");
        }

        // Check if attempt was n-d and expected as 1-d
        if (value instanceof Array) {
            throw new Error("\tReason: Given value is array, but expected a non-array type.");
        }

        // All other attempts are fatal
        throw new Error("\tReason: Mapping failed because of an unknown error.");

    }


    ///////////////////////////
    // JSON2TYPESCRIPT TYPES //
    ///////////////////////////
    

    /**
     * Returns a string representation of the expected type.
     *
     * @param expectedType the expected expectedType given from the decorator
     *
     * @returns {string} the string representation
     */
    private getExpectedType(expectedType: any): string {

        let type: string = "";

        if (expectedType instanceof Array) {
            type = "[";
            for (let i = 0; i < expectedType.length; i++) {
                if (i > 0) type += ",";
                type += this.getExpectedType(expectedType[i]);
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
     * Returns a string representation of the JSON value type.
     *
     * @param jsonValue the JSON value
     *
     * @returns {string} the string representation
     */
    private getJsonType(jsonValue: any): string {

        if (jsonValue === null) return "null";

        let type: string = "";

        if (jsonValue instanceof Array) {
            type = "[";
            for (let i = 0; i < jsonValue.length; i++) {
                if (i > 0) type += ",";
                type += this.getJsonType(jsonValue[i]);
            }
            type += "]";
            return type;
        } else {
            return typeof(jsonValue);
        }

    }

    /**
     * Returns a string representation of the true TypeScript type.
     *
     * @param trueValue the true value
     *
     * @returns {string} the string representation
     */
    private getTrueType(trueValue: any): string {
        return typeof(trueValue);
    }

}