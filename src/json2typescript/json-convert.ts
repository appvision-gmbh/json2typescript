import { OperationMode, PropertyMatchingRule, ValueCheckingMode } from "./json-convert-enums";
import { MappingOptions, Settings } from "./json-convert-options";
import { Any } from "./any";

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

    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
     */
    private _propertyMatchingRule: number = PropertyMatchingRule.CASE_STRICT;

    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
     * @returns {number}
     */
    get propertyMatchingRule(): number {
        return this._propertyMatchingRule;
    }

    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
     * @param value
     */
    set propertyMatchingRule(value: number) {
        if (value in PropertyMatchingRule) this._propertyMatchingRule = value;
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
     * @param propertyMatchingRule optional param (default: PropertyMatchingRule.CASE_STRICT)
     */
    constructor(operationMode?: number, valueCheckingMode?: number, ignorePrimitiveChecks?: boolean, propertyMatchingRule?: number) {
        if (operationMode !== undefined && operationMode in OperationMode) this.operationMode = operationMode;
        if (valueCheckingMode !== undefined && valueCheckingMode in ValueCheckingMode) this.valueCheckingMode = valueCheckingMode;
        if (ignorePrimitiveChecks !== undefined) this.ignorePrimitiveChecks = ignorePrimitiveChecks;
        if (propertyMatchingRule !== undefined) this.propertyMatchingRule = propertyMatchingRule;
    }


    ////////////////////
    // PUBLIC METHODS //
    ////////////////////


    /**
     * Tries to serialize a TypeScript object or array of objects to JSON.
     *
     * @param data object or array of objects
     *
     * @returns the JSON object
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serialize<T>(data: T | T[]): any | any[] {

        if (this.operationMode === OperationMode.DISABLE) {
            return data;
        }

        // Call the appropriate method depending on the type
        if (data instanceof Array) {
            return this.serializeArrayUtil(data).value;
        } else if (typeof data === "object") { // careful: an array is an object in TypeScript!
            return this.serializeObjectUtil(data).value;
        } else {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter data in JsonConvert.serialize() is not in valid format (object or array)." +
                "\n"
            );
        }

    }

    /**
     * Tries to serialize a TypeScript object to a JSON object.
     *
     * @param instance TypeScript instance
     *
     * @returns the JSON object
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeObject<T>(instance: T): any {
        return this.serializeObjectUtil(instance).value;        
    }

    /**
     * Tries to serialize a TypeScript array to a JSON array.
     *
     * @param instanceArray array of TypeScript instances
     *
     * @returns the JSON array
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeArray<T>(instanceArray: T[]): any[] {
        return this.serializeArrayUtil(instanceArray).value;
    }

    /**
     * Tries to serialize a TypeScript object or array of objects to JSON.
     *
     * @param data object or array of objects
     *
     * @returns maximum serialized object and error object     
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    trySerialize<T>(data: T | T[]): {value: any | any[], error: any} {

        if (this.operationMode === OperationMode.DISABLE) {
            return {value: data, error: {}};
        }

        // Call the appropriate method depending on the type
        if (data instanceof Array) {
            return this.serializeArrayUtil(data, true);
        } else if (typeof data === "object") { // careful: an array is an object in TypeScript!
            return this.serializeObjectUtil(data, true);
        } else {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter data in JsonConvert.serialize() is not in valid format (object or array)." +
                "\n"
            );
        }

    }

    /**
     * Tries to deserialize given JSON to a TypeScript object or array of objects.
     *
     * @param json the JSON as object or array
     * @param classReference the class reference
     *
     * @returns the deserialized data (TypeScript instance or array of TypeScript instances)
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserialize<T>(json: any, classReference: { new(): T }): T | T[] {

        if (this.operationMode === OperationMode.DISABLE) {
            return json;
        }

        // Call the appropriate method depending on the type
        if (json instanceof Array) {
            return this.deserializeArrayUtil(json, classReference).value;                
        } else if (typeof json === "object") { // careful: an array is an object in TypeScript!
            return this.deserializeObjectUtil(json, classReference).value;
        } else {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter json in JsonConvert.deserialize() is not in valid JSON format (object or array)." +
                "\n"
            );
        }
    }

    /**
     * Tries to deserialize a JSON object to a TypeScript object.
     *
     * @param jsonObject the JSON object
     * @param classReference the class reference
     *
     * @returns the deserialized TypeScript instance
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeObject<T>(jsonObject: any, classReference: { new(): T }): T {
        return this.deserializeObjectUtil(jsonObject, classReference).value;
    }

    /**
     * Tries to deserialize a JSON array to a TypeScript array.
     *
     * @param jsonArray the JSON array
     * @param classReference the object class
     *
     * @returns the deserialized array of TypeScript instances
     *
     * @throws an Error in case of failure
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeArray<T>(jsonArray: any[], classReference: { new(): T }): T[] {
        return this.deserializeArrayUtil(jsonArray, classReference).value;
    }


    /**
     * Tries to deserialize given JSON to a TypeScript object or array of objects.
     *
     * @param json the JSON as object or array
     * @param classReference the class reference
     *
     * @returns "possible" deserialized data (TypeScript instance or array of TypeScript instances) and error data
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    tryDeserialize<T>(json: any, classReference: { new(): T }): {value: any, error: any} {        

        if (this.operationMode === OperationMode.DISABLE) {
            return { value: json, error: {} };
        }

        // Call the appropriate method depending on the type
        if (json instanceof Array) {
            return this.deserializeArrayUtil(json, classReference, true);                
        } else if (typeof json === "object") { // careful: an array is an object in TypeScript!
            return this.deserializeObjectUtil(json, classReference, true);
        } else {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter json in JsonConvert.deserialize() is not in valid JSON format (object or array)." +
                "\n"
            );
        }
    }

        /**
     * Tries to serialize a TypeScript object to a JSON object.
     *
     * @param instance TypeScript instance
     * @param catchAllErrors optional param (default: false), if given, we are catching all errors
     *
     * @returns the maximum serialized JSON and error object
     *
     * @throws an Error in case of failure and catchAllErrors = false
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private serializeObjectUtil<T>(instance: T, catchAllErrors: boolean = false): {value: any, error: any} {

        if (this.operationMode === OperationMode.DISABLE) {
            return {value: instance, error: {}};
        }

        // Check if the passed type is allowed
        if (instance === undefined) {

            if (catchAllErrors) {
                return {
                    value: instance,
                    error: "Parameter is undefined."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter instance in JsonConvert.serializeObject() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (instance === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
                
                if (catchAllErrors) {
                    return {
                        value: instance,
                        error: "Property is NULL."
                    };
                }
                
                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter instance in JsonConvert.serializeObject() is undefined. You have specified to disallow null values." +
                    "\n"
                );
            } else {
                return {value: instance, error: {}};
            }

        } else if (typeof (instance) !== "object" || instance instanceof Array) {

            if (catchAllErrors) {
                return {
                    value: instance,
                    error: "Parameter is not of type object."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter instance in JsonConvert.serializeObject() is not of type object." +
                "\n"
            );

        }

        // Now serialize and return the plain object
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript instance:");
            console.log(instance);
        }

        let jsonObject: any = {};
        let errorObject: any = {};

        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(instance)) {
            this.serializeObject_loopProperty(instance, propertyKey, jsonObject, errorObject, catchAllErrors);
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning JSON object:");
            console.log(jsonObject);
            console.log("----------");
        }

        return {value: jsonObject, error: errorObject};

    }

    /**
     * Tries to serialize a TypeScript array to a JSON array.
     *
     * @param instanceArray the maximum serialized JSON array and error array
     * @param catchAllErrors boolean
     * @returns the JSON array
     *
     * @throws an Error in case of failure and catchAllErrors = false
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private serializeArrayUtil<T>(instanceArray: T[], catchAllErrors: boolean = false): {value: any[], error: any} {

        if (this.operationMode === OperationMode.DISABLE) {
            return {value: instanceArray, error: []};
        }

        // Check if the passed type is allowed
        if (instanceArray === undefined) {

            if (catchAllErrors) {
                return {
                    value: instanceArray,
                    error: "Property is undefined."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter instanceArray in JsonConvert.serializeArray() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (instanceArray === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
                
                if (catchAllErrors) {
                    return {
                        value: instanceArray,
                        error: "Property is null."
                    };
                }
                
                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter instanceArray in JsonConvert.serializeArray() is undefined. You have specified to disallow null values." +
                    "\n"
                );
            } else {
                return {value: instanceArray, error: []};
            }

        } else if (typeof (instanceArray) !== "object" || instanceArray instanceof Array === false) {

            if (catchAllErrors) {
                return {
                    value: instanceArray,
                    error: "Property is not of type array."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter instanceArray in JsonConvert.serializeArray() is not of type array." +
                "\n"
            );

        }

        // Now serialize and return the plain object
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JavaScript array:");
            console.log(instanceArray);
        }

        let jsonArray: any[] = [];
        let errorArray: any[] = [];

        // Loop through all array elements
        for (const classInstance of <any> instanceArray) {
            const {value, error} = this.serializeObjectUtil(classInstance, catchAllErrors);
            jsonArray.push(value);
            errorArray.push(error);
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning JSON array:");
            console.log(jsonArray);
            console.log("----------");
        }

        return {value: jsonArray, error: errorArray};

    }

    /**
     * Tries to deserialize a JSON object to a TypeScript object.
     *
     * @param jsonObject the JSON object
     * @param classReference the class reference
     * @param catchAllErrors optional param (default: false), if given, we are catching all errors

     * @returns the maximum possible deserialized TypeScript instance and error data
     *
     * @throws an Error in case of failure and catchAllErrors = false
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private deserializeObjectUtil<T>(jsonObject: any, classReference: { new(): T }, catchAllErrors: boolean = false): {value: T, error: any} {

        if (this.operationMode === OperationMode.DISABLE) {
            return { value: jsonObject, error: {} };
        }

        // Check if the passed type is allowed
        if (jsonObject === undefined) {

            if (catchAllErrors) {
                return {
                    value: jsonObject,
                    error: "Property is undefined."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (jsonObject === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {

                if (catchAllErrors) {
                    return {
                        value: jsonObject,
                        error: "Property is NULL."
                    };
                }

                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter jsonObject in JsonConvert.deserializeObject() is undefined. You have specified to disallow null values." +
                    "\n"
                );
            } else {
                
                return {
                    value: jsonObject,
                    error: {}
                };
            }

        } else if (typeof (jsonObject) !== "object" || jsonObject instanceof Array) {

            if (catchAllErrors) {
                return {
                    value: jsonObject,
                    error: "Property is not of type object."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object." +
                "\n"
            );

        }

        // Now deserialize and return the instance
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JSON object:");
            console.log(jsonObject);
        }

        let instance: T = new classReference();
        let errorObject = {};

        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(instance)) {
            this.deserializeObject_loopProperty(instance, propertyKey, jsonObject, errorObject, catchAllErrors);
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning CLASS instance:");
            console.log(instance);
            console.log("----------");
        }

        return {value: instance, error: errorObject};

    }

    /**
     * Tries to deserialize a JSON array to a TypeScript array.
     *
     * @param jsonArray the JSON array
     * @param classReference the object class
     * @param catchAllErrors optional param (default: false), if given, we are catching all errors
     * 
     * @returns the maximum possible deserialized array of TypeScript instances and error data
     *
     * @throws an Error in case of failure and catchAllErrors = false
     *
     * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private deserializeArrayUtil<T>(jsonArray: any[], classReference: { new(): T }, catchAllErrors: boolean = false): {value: T[], error: any } {


        if (this.operationMode === OperationMode.DISABLE) {
            return {value: jsonArray, error: []};
        }

        // Check if the passed type is allowed
        if (jsonArray === undefined) {

            if (catchAllErrors) {
                return {
                    value: jsonArray,
                    error: "Property is undefined."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeObject() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (jsonArray === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
                
                if (catchAllErrors) {
                    return {
                        value: jsonArray,
                        error: "Property is NULL."
                    };
                }                
                
                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter jsonArray in JsonConvert.deserializeObject() is undefined. You have specified to disallow null values." +
                    "\n"
                );
            } else {
                return {
                    value: jsonArray,
                    error: []
                };
            }

        } else if (typeof (jsonArray) !== "object" || jsonArray instanceof Array === false) {

            if (catchAllErrors) {
                return {
                    value: jsonArray,
                    error: "Property is not of type array."
                };
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array." +
                "\n"
            );

        }

        // Now deserialize and return the array
       
        if (this.operationMode === OperationMode.LOGGING) {
            console.log("----------");
            console.log("Receiving JSON array:");
            console.log(jsonArray);
        }

        let array: T[] = [];
        let errorArray = [];

        // Loop through all array elements
        for (const jsonObject of jsonArray) {
            let {value, error} = this.deserializeObjectUtil<T>(jsonObject, classReference, catchAllErrors);
            array.push(value);
            errorArray.push(error)
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning array of CLASS instances:");
            console.log(array);
            console.log("----------");
        }

        return {value: array, error: errorArray};

    }


    /////////////////////
    // PRIVATE METHODS //
    /////////////////////


    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param classPropertyName the property name
     * @param json the JSON object
     * @param errorObject the errorObject
     * @param catchAllErrors optional param (default: false), if given, we are catching all errors
     *
     * @throws an Error in case of failure and catchAllErrors = false
     */
    private serializeObject_loopProperty(instance: any, classPropertyName: string, json: any, errorObject: any, catchAllErrors: boolean = false): void {

        // Check if a JSON-object mapping is possible for a property
        const mappingOptions: MappingOptions | null = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }


        // Get expected and real values
        let jsonPropertyName: string = mappingOptions.jsonPropertyName;
        let expectedJsonType: any = mappingOptions.expectedJsonType;
        let isOptional: boolean = mappingOptions.isOptional;
        let customConverter: any = mappingOptions.customConverter;

        let classInstancePropertyValue: any = instance[classPropertyName];


        // Check if the class property value exists
        if (typeof (classInstancePropertyValue) === "undefined") {

            if (isOptional) return;

            if (catchAllErrors) {
                
                errorObject[classPropertyName] = "Failed to map the JavaScript instance of class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" to JSON because the defined class property \"" + classPropertyName + "\" does not exist or is not defined:\n\n";
                return classInstancePropertyValue;

            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" to JSON because the defined class property \"" + classPropertyName + "\" does not exist or is not defined:\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tJSON property: \n\t\t" + jsonPropertyName + "\n\n"
            );
        }


        // Check if the property is optional
        // If the json value is null, we don't assign it in that case
        if (isOptional && classInstancePropertyValue === null) return;


        // Map the property
        try {
            const propValue = customConverter !== null ? customConverter.serialize(classInstancePropertyValue) : this.verifyProperty(expectedJsonType, classInstancePropertyValue, true, true);

            if (typeof propValue === "object" && propValue["value"] && propValue["error"]) {
                json[jsonPropertyName] = propValue["value"];
                
                if (this.isNonEmpty(propValue["error"]))                
                    errorObject[classPropertyName] = propValue["error"];

            } else {
                json[jsonPropertyName] = propValue;
            }

        } catch (e) {

            if (catchAllErrors) {
                errorObject[classPropertyName] = "Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" to JSON because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tClass property value: \n\t\t" + classInstancePropertyValue + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tRuntime type: \n\t\t" + this.getTrueType(classInstancePropertyValue) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonPropertyName + "\n\n" +
                e.message + "\n";

                return classInstancePropertyValue;
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JavaScript instance of class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" to JSON because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tClass property value: \n\t\t" + classInstancePropertyValue + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tRuntime type: \n\t\t" + this.getTrueType(classInstancePropertyValue) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonPropertyName + "\n\n" +
                e.message + "\n"
            );
        }
    }

    /**
     * Tries to find the JSON mapping for a given class property and finally assign the value.
     *
     * @param instance the instance of the class
     * @param classPropertyName the property name
     * @param json the JSON object
     * @param errorObject the error object
     * @param catchAllErrors optional param (default: false), if given, we are catching all errors
     *
     * @throws an Error in case of failure and catchAllErrors = false
     */
    private deserializeObject_loopProperty(instance: any, classPropertyName: string, json: any, errorObject: any, catchAllErrors: boolean = false): void {

        const mappingOptions: MappingOptions | null = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }

        // Get expected and real values
        let jsonPropertyName: string = mappingOptions.jsonPropertyName;
        let expectedJsonType: any = mappingOptions.expectedJsonType;
        let isOptional: boolean = mappingOptions.isOptional;
        let customConverter: any = mappingOptions.customConverter;

        let jsonValue: any = undefined;
        try {
            jsonValue = this.getObjectValue(json, jsonPropertyName);
        } catch {}


        // Check if the json value exists
        if (typeof (jsonValue) === "undefined") {

            if (isOptional) return;

            if (catchAllErrors) {
                errorObject[classPropertyName] = "Failed to map the JSON object to the class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" because the defined JSON property \"" + jsonPropertyName + "\" does not exist:\n\n"
                return jsonValue;
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" because the defined JSON property \"" + jsonPropertyName + "\" does not exist:\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tJSON property: \n\t\t" + jsonPropertyName + "\n\n"
            );
        }


        // Check if the property is optional
        // If the json value is null, we don't assign it in that case
        if (isOptional && jsonValue === null) return;


        // Map the property
        try {
            const propValue = customConverter !== null ? customConverter.deserialize(jsonValue) : this.verifyProperty(expectedJsonType, jsonValue, false, catchAllErrors);
        
            if (typeof propValue === "object" && propValue["value"] && propValue["error"]) {
                instance[classPropertyName] = propValue["value"];
                
                if (this.isNonEmpty(propValue["error"]))                
                    errorObject[classPropertyName] = propValue["error"];

            } else {
                instance[classPropertyName] = propValue;
            }         
        
        } catch (e) {

            if (catchAllErrors) {
                errorObject[classPropertyName] = "Failed to map the JSON object to the class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonPropertyName + "\n\n" +
                "\tJSON type: \n\t\t" + this.getJsonType(jsonValue) + "\n\n" +
                "\tJSON value: \n\t\t" + JSON.stringify(jsonValue) + "\n\n" +
                e.message + "\n";

                return jsonValue;
            }

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Failed to map the JSON object to the class \"" + instance[Settings.CLASS_IDENTIFIER] + "\" because of a type error.\n\n" +
                "\tClass property: \n\t\t" + classPropertyName + "\n\n" +
                "\tExpected type: \n\t\t" + this.getExpectedType(expectedJsonType) + "\n\n" +
                "\tJSON property: \n\t\t" + jsonPropertyName + "\n\n" +
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
     * Gets the mapping options of a given class property.
     *
     * @param instance any class instance
     * @param {string} propertyName any property name
     *
     * @returns {MappingOptions|null}
     */
    private getClassPropertyMappingOptions(instance: any, propertyName: string): MappingOptions | null {

        let mappings: any = instance[Settings.MAPPING_PROPERTY];

        // Check if mapping is defined
        if (typeof (mappings) === "undefined") return null;

        // Get direct mapping if possible
        const directMappingName: string = instance[Settings.CLASS_IDENTIFIER] + "." + propertyName;
        if (typeof (mappings[directMappingName]) !== "undefined") {
            return mappings[directMappingName];
        }

        // No mapping was found, try to find some
        const indirectMappingNames: string[] = Object.keys(mappings).filter(key => key.match("\\." + propertyName + "$")); // use endsWidth in later versions
        if (indirectMappingNames.length > 0) {
            return mappings[indirectMappingNames[0]];
        }

        return null;

    }

    /**
     * Compares the type of a given value with an internal expected json type.
     * Either returns the resulting value or throws an exception.
     *
     * @param expectedJsonType the expected json type for the property
     * @param value the property value to verify
     * @param serialize optional param (default: false), if given, we are in serialization mode
     * @param catchAllErrors optional param (default: false), if given, we are catching all errors
     * 
     * @returns returns the resulted mapped property
     *
     * @throws an error in case of failure
     */
    private verifyProperty(expectedJsonType: any, value: any, serialize?: boolean, catchAllErrors?: boolean): any {

        // Map immediately if we don't care about the type
        if (expectedJsonType === Any || expectedJsonType === null || expectedJsonType === Object) {
            return value;
        }

        // Check if attempt and expected was 1-d
        if (expectedJsonType instanceof Array === false && value instanceof Array === false) {

            // Check the type
            if (typeof (expectedJsonType) !== "undefined" && expectedJsonType.prototype.hasOwnProperty(Settings.CLASS_IDENTIFIER)) { // only decorated custom objects have this injected property

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: Given value is null.");
                }

                if (serialize) return this.serializeObjectUtil(value, catchAllErrors);
                else {
                    return this.deserializeObjectUtil(value, expectedJsonType, catchAllErrors);
                }

            } else if (expectedJsonType === Any || expectedJsonType === null || expectedJsonType === Object) { // general object

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL)
                        return null;
                    else throw new Error("\tReason: Given value is null.");
                }

                return value;

            } else if (expectedJsonType === String || expectedJsonType === Number || expectedJsonType === Boolean) { // otherwise check for a primitive type

                // Check if we have null value
                if (value === null) {
                    if (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL) return null;
                    else throw new Error("\tReason: Given value is null.");
                }

                // Check if the types match
                if ( // primitive types match
                    (expectedJsonType === String && typeof (value) === "string") ||
                    (expectedJsonType === Number && typeof (value) === "number") ||
                    (expectedJsonType === Boolean && typeof (value) === "boolean")
                ) {
                    return value;
                } else { // primitive types mismatch
                    if (this.ignorePrimitiveChecks) return value;
                    throw new Error("\tReason: Given object does not match the expected primitive type.");
                }

            } else { // other weird types

                throw new Error(
                    "\tReason: Expected type is unknown. There might be multiple reasons for this:\n" +
                    "\t- You are missing the decorator @JsonObject (for object mapping)\n" +
                    "\t- You are missing the decorator @JsonConverter (for custom mapping) before your class definition\n" +
                    "\t- Your given class is undefined in the decorator because of circular dependencies"
                );

            }

        }

        // Check if attempt and expected was n-d
        if (expectedJsonType instanceof Array && value instanceof Array) {

            let array: any[] = [];

            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the value as is
            if (expectedJsonType.length === 0) {
                return value;
            }

            // Loop through the data. Both type and value are at least of length 1
            let autofillType: boolean = expectedJsonType.length < value.length;
            for (let i = 0; i < value.length; i++) {

                if (autofillType && i >= expectedJsonType.length) expectedJsonType[i] = expectedJsonType[i - 1];

                array[i] = this.verifyProperty(expectedJsonType[i], value[i], serialize, catchAllErrors);

            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedJsonType instanceof Array && value instanceof Object) {

            let array: any[] = [];

            // No data given, so return empty value
            if (value.length === 0) {
                return array;
            }

            // We obviously don't care about the type, so return the json value as is
            if (expectedJsonType.length === 0) {
                return value;
            }

            // Loop through the data. Both type and value are at least of length 1
            let autofillType: boolean = expectedJsonType.length < Object.keys(value).length;
            let i = 0;
            for (let key in value) {

                if (autofillType && i >= expectedJsonType.length) expectedJsonType[i] = expectedJsonType[i - 1];

                array[key as any] = this.verifyProperty(expectedJsonType[i], value[key], serialize, catchAllErrors);

                i++;
            }

            return array;

        }

        // Check if attempt was 1-d and expected was n-d
        if (expectedJsonType instanceof Array) {
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

    /**
     * Gets the value of an object for a given value.
     * If the object does not have the specific key, an Error is thrown.
     *
     * @param data
     * @param key
     *
     * @returns returns the value
     *
     * @throws an Error in case of the key was not found in the object
     */
    private getObjectValue(data: any, key: string): any {

        // If we do not care about the case of the key, ad
        if (this.propertyMatchingRule === PropertyMatchingRule.CASE_INSENSITIVE) {

            // Create a mapping of the keys: keys[lowercase]=normalcase
            const keyMapping: any = Object.keys(data).reduce((keys: string[], key: string) => {
                keys[<any>key.toLowerCase()] = key;
                return keys;
            }, {});

            // Define the new key
            key = keyMapping[key.toLowerCase()];

        }

        // Throw an error if the key is not in the object
        if (key in data === false) {
            throw new Error();
        }

        return data[key];

    }


    ///////////////////////////
    // JSON2TYPESCRIPT TYPES //
    ///////////////////////////


    /**
     * Returns a string representation of the expected json type.
     *
     * @param expectedJsonType the expected type given from the decorator
     *
     * @returns {string} the string representation
     */
    private getExpectedType(expectedJsonType: any): string {

        let type: string = "";

        if (expectedJsonType instanceof Array) {
            type = "[";
            for (let i = 0; i < expectedJsonType.length; i++) {
                if (i > 0) type += ",";
                type += this.getExpectedType(expectedJsonType[i]);
            }
            type += "]";
            return type;
        } else {
            if (expectedJsonType === Any || expectedJsonType === null || expectedJsonType === Object) {
                return "any";
            } else if (expectedJsonType === String || expectedJsonType === Boolean || expectedJsonType === Number) {
                return (new expectedJsonType()).constructor.name.toLowerCase();
            } else if (typeof expectedJsonType === 'function') {
                return (new expectedJsonType()).constructor.name;
            } else if (expectedJsonType === undefined) {
                return "undefined"
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
            return typeof (jsonValue);
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
        return typeof (trueValue);
    }

    private isNonEmpty(obj: any): boolean {
        
        if (obj instanceof Array) {
            return obj.length > 0;
        } else if (typeof obj === "object") {
            return Object.keys(obj).length > 0;
        } else {
            return obj.length > 0;
        }

    }
 
}
