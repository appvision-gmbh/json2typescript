import { Any } from "./any";
import { OperationMode, PropertyConvertingMode, PropertyMatchingRule, ValueCheckingMode } from "./json-convert-enums";
import { MappingOptions, Settings } from "./json-convert-options";

/**
 * Offers a simple API for mapping JSON objects to TypeScript/JavaScript classes and vice versa.
 *
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
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
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
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set operationMode(value: number) {
        if (value in OperationMode) this._operationMode = value;
    }

    /**
     * Determines which types are allowed to be null.
     * This setting may be overridden by property settings (see PropertyConvertingMode).
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated
     */
    private _valueCheckingMode: number = ValueCheckingMode.ALLOW_OBJECT_NULL;

    /**
     * Determines which types are allowed to be null.
     * This setting may be overridden by property settings (see PropertyConvertingMode).
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    get valueCheckingMode(): number {
        return this._valueCheckingMode;
    }

    /**
     * Determines which types are allowed to be null.
     * This setting may be overridden by property settings (see PropertyConvertingMode).
     *
     * You may assign three different values:
     * - ValueCheckingMode.ALLOW_NULL: all given values are allowed to be null
     * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects are allowed to be null, primitive types are not allowed to be null
     * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set valueCheckingMode(value: number) {
        if (value in ValueCheckingMode) this._valueCheckingMode = value;
    }

    /**
     * Determines whether a missing or undefined property value should be considered as null or not.
     *
     * If true, a missing JSON value will be added and set as null before deserialization.
     * For serialization, undefined values will be set to null before serialization.
     *
     * The ValueCheckingMode and PropertyConvertingMode determine whether an error will be thrown during
     * serialization or deserialization.
     */
    private _mapUndefinedToNull: boolean = false;

    /**
     * Determines whether a missing or undefined property value should be considered as null or not.
     *
     * If true, a missing JSON value will be added and set as null before deserialization.
     * For serialization, undefined values will be set to null before serialization.
     *
     * ValueCheckingMode and PropertyConvertingMode determine whether an error will be thrown during
     * serialization or deserialization.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    get mapUndefinedToNull(): boolean {
        return this._mapUndefinedToNull;
    }

    /**
     * Determines whether a missing or undefined property value should be considered as null or not.
     *
     * If true, a missing JSON value will be added and set as null before deserialization.
     * For serialization, undefined values will be set to null before serialization.
     *
     * The ValueCheckingMode and PropertyConvertingMode determine whether an error will be thrown during
     * serialization or deserialization.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set mapUndefinedToNull(value: boolean) {
        this._mapUndefinedToNull = value;
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
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    get ignorePrimitiveChecks(): boolean {
        return this._ignorePrimitiveChecks;
    }

    /**
     * Determines whether primitive types should be checked.
     * If true, it will be allowed to assign primitive to other primitive types.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set ignorePrimitiveChecks(value: boolean) {
        this._ignorePrimitiveChecks = value;
    }

    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they
     * are not case sensitive
     */
    private _propertyMatchingRule: number = PropertyMatchingRule.CASE_STRICT;

    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they
     * are not case sensitive
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    get propertyMatchingRule(): number {
        return this._propertyMatchingRule;
    }

    /**
     * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
     *
     * You may assign the following values:
     * - PropertyMatchingRule.CASE_STRICT: JSON properties need to match exactly the names in the decorators
     * - PropertyMatchingRule.CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they
     * are not case sensitive
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set propertyMatchingRule(value: number) {
        if (value in PropertyMatchingRule) this._propertyMatchingRule = value;
    }

    /**
     * Determines how nullable property types should be serialized and deserialized.
     * Nullable types are either missing (in JSON), undefined (in TypeScript) or null (both).
     *
     * If the propertyConvertingMode has a non-undefined value, it overrides the individual settings of every property.
     *
     * The values should be used as follows:
     * Determines how nullable property types should be serialized and deserialized.
     * Nullable types are either missing (in JSON), undefined (in TypeScript) or null (both).
     *
     * If the propertyConvertingMode has a non-undefined value, it overrides the individual settings of every property.
     *
     * The values should be used as follows:
     * - MAP_NULLABLE: the mapper is applied, type is checked
     * - IGNORE_NULLABLE: the mapper is not applied if the property is missing, undefined or null; the property is
     * not added to the result
     * - PASS_NULLABLE: the mapper is not applied if the property is missing, undefined or null; the property is
     * added with its value to the result
     */
    private _propertyConvertingMode: PropertyConvertingMode | undefined = undefined;

    /**
     * Determines how nullable property types should be serialized and deserialized.
     * Nullable types are either missing (in JSON), undefined (in TypeScript) or null (both).
     *
     * If the propertyConvertingMode has a non-undefined value, it overrides the individual settings of every property.
     *
     * The values should be used as follows:
     * - MAP_NULLABLE: the mapper is applied, type is checked
     * - IGNORE_NULLABLE: the mapper is not applied if the property is missing, undefined or null; the property is
     * not added to the result
     * - PASS_NULLABLE: the mapper is not applied if the property is missing, undefined or null; the property is
     * added with its value to the result
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    get propertyConvertingMode(): PropertyConvertingMode | undefined {
        return this._propertyConvertingMode;
    }

    /**
     * Determines how nullable property types should be serialized and deserialized.
     * Nullable types are either missing (in JSON), undefined (in TypeScript) or null (both).
     *
     * If the propertyConvertingMode has a non-undefined value, it overrides the individual settings of every property.
     *
     * The values should be used as follows:
     * - MAP_NULLABLE: the mapper is applied, type is checked
     * - IGNORE_NULLABLE: the mapper is not applied if the property is missing, undefined or null; the property is
     * not added to the result
     * - PASS_NULLABLE: the mapper is not applied if the property is missing, undefined or null; the property is
     * added with its value to the result
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set propertyConvertingMode(value: PropertyConvertingMode | undefined) {
        this._propertyConvertingMode = value;
    }

    /**
     * @deprecated
     */
    get ignoreRequiredCheck(): boolean {
        return this.propertyConvertingMode === PropertyConvertingMode.IGNORE_NULLABLE;
    }

    /**
     * @deprecated
     */
    set ignoreRequiredCheck(value: boolean) {
        this.propertyConvertingMode = value ? PropertyConvertingMode.IGNORE_NULLABLE : undefined;
    }

    /**
     * Determines if discriminators should be used.
     * If this option is set to true, all registered classes will be serialized with an additional discriminator
     * property (default: "$type"), which has the key of the class (given in the @JsonObject decorator) as value.
     * When deserializing an object containing the discriminator property, json2typescript will attempt to
     * automatically instantiate the correct type (by comparing the value of the discriminator property with the
     * registered classes).
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private _useDiscriminator: boolean = false;

    /**
     * Determines if discriminators should be used.
     * If this option is set to true, all registered classes will be serialized with an additional discriminator
     * property (default: "$type"), which has the key of the class (given in the @JsonObject decorator) as value.
     * When deserializing an object containing the discriminator property, json2typescript will attempt to
     * automatically instantiate the correct type (by comparing the value of the discriminator property with the
     * registered classes).
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    get useDiscriminator(): boolean {
        return this._useDiscriminator;
    }

    /**
     * Determines if discriminators should be used.
     * If this option is set to true, all registered classes will be serialized with an additional discriminator
     * property (default: "$type"), which has the key of the class (given in the @JsonObject decorator) as value.
     * When deserializing an object containing the discriminator property, json2typescript will attempt to
     * automatically instantiate the correct type (by comparing the value of the discriminator property with the
     * registered classes).
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set useDiscriminator(value: boolean) {
        this._useDiscriminator = value;
    }

    /**
     * Defines the name of the discriminator property.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private _discriminatorPropertyName: string = "$type";

    /**
     * Defines the name of the discriminator property.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    get discriminatorPropertyName(): string {
        return this._discriminatorPropertyName;
    }

    /**
     * Defines the name of the discriminator property.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    set discriminatorPropertyName(value: string) {
        this._discriminatorPropertyName = value;
    }

    /**
     * Determines all classes which should use the discriminator feature.
     * Only classes provided here can be enriched with the discriminator property.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private _classes: Map<string, (new() => any)> = new Map();

    /**
     * Determines all classes which should use the discriminator feature.
     * Only classes provided here can be enriched with the discriminator property.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    private get classes(): Map<string, (new() => any)> {
        return this._classes;
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
     * Registers a list of classes to be used in the discriminator feature.
     * After registering these classes, they may be used for the discriminator feature.
     *
     * @param classReferences the class references
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    registerClasses(...classReferences: { new(): any }[]): void {
        classReferences.forEach((classReference: { new(): any }) => {
            const key = classReference.prototype[Settings.CLASS_IDENTIFIER] || classReference.name;
            if (key) {
                this.classes.set(key, classReference);
            }
        });
    }

    /**
     * Unregisters a list of classes from the discriminator feature.
     * After unregistering these classes, they cannot be used anymore for the discriminator feature.
     *
     * @param classReferences the class references
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    unregisterClasses(...classReferences: { new(): any }[]): void {
        classReferences.forEach((classReference: { new(): any }) => {
            const key = classReference.prototype[Settings.CLASS_IDENTIFIER] || classReference.name;
            this.classes.delete(key);
        });
    }

    /**
     * Unregisters all classes from discriminator feature.
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    unregisterAllClasses(): void {
        this.classes.clear();
    }

    /**
     * Tries to serialize a TypeScript object or array of objects to JSON using the mappings defined on
     * the specified class reference. Note that if a class reference is provided, it will be used as
     * the source of property mapping for serialization, even if the object or one of its elements is
     * an instance of a different class with its own mappings.  Also, ONLY the properties from the
     * class reference will be serialized - any additional properties on the object(s) will be silently
     * ignored.
     *
     * @param data object or array of objects
     * @param classReference the class reference which provides the property mappings to use
     *
     * @returns the JSON object
     *
     * @throws an Error in case of failure
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serialize<T extends object, U extends object = {}>(data: T | T[], classReference?: { new(): U }): any | any[] {

        if (this.operationMode === OperationMode.DISABLE) {
            return data;
        }

        // Call the appropriate method depending on the type
        if (data instanceof Array) {
            return this.serializeArray(data, classReference);
        } else if (typeof data === "object") { // careful: an array is an object in TypeScript!
            return this.serializeObject(data, classReference);
        } else {
            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter data in JsonConvert.serialize() is not in valid format (object or array)." +
                "\n"
            );
        }
    }

    /**
     * Tries to serialize a TypeScript object to a JSON object using either the mappings on the
     * provided class reference, if present, or on the provided object. Note that if a class
     * reference is provided, it will be used as the source of property mapping for serialization,
     * even if the object is itself an instance of a different class with its own mappings.
     * Also, ONLY the properties from the class reference will be serialized - any additional
     * properties on the object will be silently ignored.
     *
     * @param data object containing the values to be mapped to a JSON object, must be an
     *             instance of a class with JSON mappings if no class reference is provided
     * @param classReference optional class reference which provides the property mappings to use
     *
     * @returns the JSON object
     *
     * @throws an Error in case of failure
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeObject<T extends object, U extends object = {}>(data: T, classReference?: { new(): U }): any {

        if (this.operationMode === OperationMode.DISABLE) {
            return data;
        }

        data = this.mapUndefinedToNull && data === undefined ? null as any : data;

        // Check if the passed type is allowed
        if (data === undefined) {

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter instance in JsonConvert.serializeObject() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (data === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter instance in JsonConvert.serializeObject() is null. You have specified to " +
                    "disallow null values." +
                    "\n"
                );
            } else {
                return data;
            }

        } else if (typeof (data) !== "object" || data instanceof Array) {

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
            console.log(data);
        }

        let jsonObject: any = {};
        let instance: T | U;
        if (!!classReference) {
            instance = new classReference();
        } else {
            instance = data;
        }

        // Loop through all initialized class properties on the mapping instance
        for (const propertyKey of Object.keys(instance)) {
            try {
                this.serializeObject_loopProperty(data, instance, propertyKey, jsonObject);
            } catch (ex) {
                if (this.operationMode === OperationMode.LOGGING) {
                    console.log("Failed to serialize property:");
                    console.log(ex);
                    console.log("----------");
                }
                throw ex;
            }
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning JSON object:");
            console.log(jsonObject);
            console.log("----------");
        }

        return jsonObject;

    }

    /**
     * Tries to serialize a TypeScript array to a JSON array using either the mappings on the
     * provided class reference, if present, or on the provided object. Note that if a class
     * reference is provided, ALL objects in the array will be serialized using the mappings
     * from that class reference, even if they're actually instances of a different class.
     * Also, ONLY the properties from the class reference will be serialized - any additional
     * properties on the objects will be silently ignored.
     *
     * @param dataArray array of objects containing the values to be mapped to a JSON object, which
     *                  must be instances of classes with JSON mappings if no class reference is provided
     * @param classReference optional class reference which provides the property mappings to use
     *
     * @returns the JSON array
     *
     * @throws an Error in case of failure
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    serializeArray<T extends object, U extends object = {}>(dataArray: T[], classReference?: { new(): U }): any[] {

        if (this.operationMode === OperationMode.DISABLE) {
            return dataArray;
        }

        dataArray = this.mapUndefinedToNull && dataArray === undefined ? null as any : dataArray;

        // Check if the passed type is allowed
        if (dataArray === undefined) {

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter instanceArray in JsonConvert.serializeArray() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (dataArray === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter instanceArray in JsonConvert.serializeArray() is null. You have specified to " +
                    "disallow null values." +
                    "\n"
                );
            } else {
                return dataArray;
            }

        } else if (typeof (dataArray) !== "object" || dataArray instanceof Array === false) {

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
            console.log(dataArray);
        }

        let jsonArray: object[] = [];

        // Loop through all array elements
        for (const dataObject of dataArray) {
            jsonArray.push(this.serializeObject(dataObject, classReference));
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
     * @returns the deserialized data (TypeScript instance or array of TypeScript instances)
     *
     * @throws an Error in case of failure
     *
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserialize<T extends object>(json: object | object[], classReference: { new(): T } | null = null): T | T[] {

        if (this.operationMode === OperationMode.DISABLE) {
            return json as T | T[];
        }

        // Call the appropriate method depending on the type
        if (json instanceof Array) {
            return this.deserializeArray(json, classReference);
        } else if (typeof json === "object") { // careful: an array is an object in TypeScript!
            return this.deserializeObject(json, classReference);
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
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeObject<T extends object>(jsonObject: any, classReference: { new(): T } | null = null): T {

        if (this.operationMode === OperationMode.DISABLE) {
            return jsonObject as T;
        }

        const realClassReference = this.getRealClassReference(jsonObject, classReference);

        jsonObject = this.mapUndefinedToNull && jsonObject === undefined ? null as any : jsonObject;

        // Check if the passed type is allowed
        if (jsonObject === undefined) {

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonObject in JsonConvert.deserializeObject() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (jsonObject === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter jsonObject in JsonConvert.deserializeObject() is null. You have specified to " +
                    "disallow null values." +
                    "\n"
                );
            } else {
                return jsonObject as T;
            }

        } else if (typeof (jsonObject) !== "object" || jsonObject instanceof Array) {

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

        let instance: T = new realClassReference();

        // Loop through all initialized class properties
        for (const propertyKey of Object.keys(instance)) {
            try {
                this.deserializeObject_loopProperty(instance, propertyKey, jsonObject);
            } catch (ex) {
                if (this.operationMode === OperationMode.LOGGING) {
                    console.log("Failed to deserialize property:");
                    console.log(ex);
                    console.log("----------");
                }
                throw ex;
            }
        }

        if (this.operationMode === OperationMode.LOGGING) {
            console.log("Returning CLASS instance:");
            console.log(instance);
            console.log("----------");
        }

        return instance;

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
     * @see https://www.npmjs.com/package/json2typescript full documentation
     */
    deserializeArray<T extends object>(jsonArray: any[], classReference: { new(): T } | null = null): T[] {

        if (this.operationMode === OperationMode.DISABLE) {
            return jsonArray as T[];
        }

        jsonArray = this.mapUndefinedToNull && jsonArray === undefined ? null as any : jsonArray;

        // Check if the passed type is allowed
        if (jsonArray === undefined) {

            throw new Error(
                "Fatal error in JsonConvert. " +
                "Passed parameter jsonArray in JsonConvert.deserializeObject() is undefined. This is not a valid JSON format." +
                "\n"
            );

        } else if (jsonArray === null) {

            if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
                throw new Error(
                    "Fatal error in JsonConvert. " +
                    "Passed parameter jsonArray in JsonConvert.deserializeObject() is null. You have specified to " +
                    "disallow null values." +
                    "\n"
                );
            } else {
                return jsonArray as T[];
            }

        } else if (typeof (jsonArray) !== "object" || jsonArray instanceof Array === false) {

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

        // Loop through all array elements
        for (const jsonObject of jsonArray) {
            array.push(this.deserializeObject<T>(jsonObject, classReference));
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
     * Returns the correct class reference for the provided JSON object.
     * If the provided class reference is null, the class reference is retrieved from the class map using the discriminator property.
     *
     * @param jsonObject the JSON object
     * @param classReference the class reference
     * @throws throws an Error in case of failure
     */
    private getRealClassReference<T extends object>(jsonObject: any, classReference: { new(): T } | null): { new(): T } {
        if (classReference === null && !this._useDiscriminator) {
            throw new Error(
              "Fatal error in JsonConvert. " +
              "Passed parameter classReference in JsonConvert.deserialize() is null. " +
              "This is only allowed if discriminator feature is enabled." +
              "\n"
            );
        }

        if (this._useDiscriminator) {
            if (jsonObject.hasOwnProperty(this._discriminatorPropertyName)) {
                const discriminatorValue: string = jsonObject[this._discriminatorPropertyName].toString();

                return this.getClassReferenceByName(discriminatorValue);
            } else {
                throw new Error(
                  "Fatal error in JsonConvert. " +
                  "Discriminator property '" + this._discriminatorPropertyName + "' is missing in JSON object." +
                  "\n"
                );
            }
        } else {
            return classReference!;
        }
    }

    /**
     * Returns the class reference for the provided name.
     *
     * @param className the class name
     * @throws throws an Error in case of failure
     */
    private getClassReferenceByName<T extends object>(className: string): { new(): T } {
        const classReferenceNameFromMap = this._classes.get(className);

        if (classReferenceNameFromMap !== undefined && classReferenceNameFromMap !== null) {
            return classReferenceNameFromMap;
        } else {
            throw new Error(
              "Fatal error in JsonConvert. " +
              "Discriminator value '" + className + "' is not mapped to a class reference." +
              "\n"
            );
        }
    }

    /**
     * Tries to find the JSON mapping for a given class property from the given instance used for mapping,
     * and finally assign the value from the given dataObject
     *
     * @param dataObject the object containing the value to be assigned
     * @param instance the instance of the class used for mapping
     * @param classPropertyName the property name
     * @param json the JSON object
     * @throws throws an Error in case of failure
     */
    private serializeObject_loopProperty(dataObject: any, instance: any, classPropertyName: string, json: any): void {

        // Check if a JSON-object mapping is possible for a property
        const mappingOptions: MappingOptions | null = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }


        // Get expected and real values
        const jsonPropertyName: string = mappingOptions.jsonPropertyName;
        const expectedJsonType: any = mappingOptions.expectedJsonType;
        const convertingMode: PropertyConvertingMode = this.propertyConvertingMode ?? mappingOptions.convertingMode;
        const customConverter: any = mappingOptions.customConverter;

        let classInstancePropertyValue: any = dataObject[classPropertyName];

        // Check if we have a nullable type
        classInstancePropertyValue = this.mapUndefinedToNull && classInstancePropertyValue === undefined ? null : classInstancePropertyValue;
        if (classInstancePropertyValue === undefined || classInstancePropertyValue === null) {
            if (convertingMode === PropertyConvertingMode.IGNORE_NULLABLE) {
                return;
            }
            if (convertingMode === PropertyConvertingMode.PASS_NULLABLE) {
                json[jsonPropertyName] = classInstancePropertyValue;
                return;
            }
        }

        // Map the property
        try {
            json[jsonPropertyName] = customConverter !== null ?
                customConverter.serialize(classInstancePropertyValue) :
                this.convertProperty(expectedJsonType, classInstancePropertyValue, convertingMode, true);

            const classConstructorName = dataObject?.constructor?.name;

            if (this._useDiscriminator && json instanceof Object) {
                this.classes.forEach((classDataObject: {new(): any}, key: string) => {
                    if (classDataObject.name === classConstructorName) {
                        json[this._discriminatorPropertyName] = key;
                    }
                });
            }

        } catch (e) {
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
     *
     * @throws throws an Error in case of failure
     */
    private deserializeObject_loopProperty(instance: any, classPropertyName: string, json: any): void {

        const mappingOptions: MappingOptions | null = this.getClassPropertyMappingOptions(instance, classPropertyName);
        if (mappingOptions === null) {
            return;
        }

        // Get expected and real values
        const jsonPropertyName: string = mappingOptions.jsonPropertyName;
        let expectedJsonType: any = mappingOptions.expectedJsonType;
        const convertingMode: PropertyConvertingMode = this.propertyConvertingMode ?? mappingOptions.convertingMode;
        const customConverter: any = mappingOptions.customConverter;

        let jsonValue: any = undefined;
        try {
            jsonValue = this.getObjectValue(json, jsonPropertyName);
        } catch {}

        // Check if we have a nullable type
        jsonValue = this.mapUndefinedToNull && jsonValue === undefined ? null : jsonValue;
        if (jsonValue === undefined || jsonValue === null) {
            if (convertingMode === PropertyConvertingMode.IGNORE_NULLABLE) {
                return;
            }
            if (convertingMode === PropertyConvertingMode.PASS_NULLABLE) {
                instance[classPropertyName] = jsonValue;
                return;
            }
        }

        // Map the property
        try {
            const classConstructorName = jsonValue instanceof Object ? jsonValue[this.discriminatorPropertyName] : null;

            if (this._useDiscriminator && this.classes.has(classConstructorName)) {
                expectedJsonType = this.classes.get(classConstructorName);
            }

            instance[classPropertyName] = customConverter !== null ?
                customConverter.deserialize(jsonValue) :
                this.convertProperty(expectedJsonType, jsonValue, convertingMode);
        } catch (e) {
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

        /* Find mapping by iterating up the prototype chain to find a matching mapping, rather than
         * just searching by property name. */
        let prototype = Object.getPrototypeOf(instance);
        /* According to documentation, we'll hit null when we've iterated all the way up to the base
         * Object, but check for undefined as well in case prototype has been manually set to
         * undefined. Note that javascript detects circular prototype references and will cause a
         * TypeError, so no need to check for self, the prototype chain will eventually terminate. */
        while (prototype !== null && prototype !== undefined) {
            const classIdentifier = prototype[Settings.CLASS_IDENTIFIER];
            if (!!classIdentifier) {
                const mappingName: string = classIdentifier + "." + propertyName;
                if (typeof (mappings[mappingName]) !== "undefined") {
                    return mappings[mappingName];
                }
            }
            prototype = Object.getPrototypeOf(prototype);
        }

        return null;

    }

    /**
     * Compares the type of a given value with an internal expected json type.
     * Either returns the resulting value or throws an exception.
     *
     * @param expectedType the expected type for the property
     * @param value the property value to verify
     * @param convertingMode the converting mode for this property
     * @param serialize optional param (default: false), if given, we are in serialization mode
     *
     * @returns returns the resulted mapped property
     *
     * @throws an error in case of failure
     */
    private convertProperty(expectedType: any, value: any, convertingMode: PropertyConvertingMode, serialize?: boolean): any {

        ////////////////////////////
        // Prior checks and setup //
        ////////////////////////////

        // Return the value immediately if we don't care about the type
        if (expectedType === undefined || expectedType === Any || expectedType === null || expectedType === Object) {
            return value;
        }

        // Check if we have a nullable type
        value = this.mapUndefinedToNull && value === undefined ? null : value;
        if (value === undefined || value === null) {
            if (convertingMode === PropertyConvertingMode.IGNORE_NULLABLE) {
                return undefined;
            }
            if (convertingMode === PropertyConvertingMode.PASS_NULLABLE) {
                return value;
            }
        }

        // Match the dimensions
        type Dimension = "1" | "2" | "1or2";

        let expectedDimension: Dimension = "1";
        if (expectedType instanceof Array) {
            expectedDimension = "2";
        }

        let valueDimension: Dimension = "1or2";
        if (value instanceof Array) {
            valueDimension = "2";
        } else if (!(value instanceof Object)) {
            valueDimension = "1";
        }

        if (expectedDimension === "1" && valueDimension === "2") {
            throw new Error("\tReason: Expected a non-array type, but given value is an array.");
        }

        if (expectedDimension === "2" && valueDimension === "1") {

            // Allow to use null in the special case
            if (value === null && this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) {
                return null;
            } else if (value === null) {
                throw new Error("\tReason: Expected an array, but given value is null.");
            }

            throw new Error("\tReason: Expected an array, but given value is a primitive type.");

        }

        //////////////////
        // Check values //
        //////////////////

        if (expectedDimension === "2" && (valueDimension === "2" || valueDimension === "1or2")) {

            // Return an empty array if we have an empty array or object as value
            if (value.length === 0 || Object.keys(value).length === 0) {
                return [];
            }

            // Return the value if we don't care about the array type
            if (expectedType.length === 0) {
                return value;
            }

            // Copy the expectedJsonType array so we don't change the class-level mapping based on the value of this property
            const jsonType: any[] = expectedType.slice(0);

            const array: any[] = [];
            if (valueDimension === "2") {

                // Loop through the data. Both type and value are at least of length 1
                let autofillType: boolean = jsonType.length < value.length;
                for (let i = 0; i < value.length; i++) {

                    if (autofillType && i >= jsonType.length) {
                        jsonType[i] = jsonType[i - 1];
                    }

                    array[i] = this.convertProperty(
                        jsonType[i],
                        value[i],
                        this.propertyConvertingMode || PropertyConvertingMode.MAP_NULLABLE,
                        serialize
                    );

                }

                return array;

            } else {

                // Loop through the data. Both type and value are at least of length 1
                let autofillType: boolean = jsonType.length < Object.keys(value).length;
                let i = 0;
                for (let key in value) {

                    if (autofillType && i >= jsonType.length) {
                        jsonType[i] = jsonType[i - 1];
                    }

                    array[key as any] = this.convertProperty(
                        jsonType[i],
                        value[key],
                        this.propertyConvertingMode || PropertyConvertingMode.MAP_NULLABLE,
                        serialize
                    );

                    i++;
                }

                return array;

            }

        } else if (expectedDimension === "1" && (valueDimension === "1" || valueDimension === "1or2")) {

            // Check if objects match
            if (expectedType instanceof Object && value instanceof Object) {
                if (expectedType.prototype.hasOwnProperty(Settings.CLASS_IDENTIFIER)) {
                    return serialize ?
                        this.serializeObject(value, expectedType) :
                        this.deserializeObject(value, expectedType);
                } else {
                    return value;
                }
            } else {

                // Check for null values
                if (value === null) {

                    if (expectedType === String || expectedType === Number || expectedType === Boolean) {

                        if (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL) {
                            return null;
                        } else {
                            throw new Error("\tReason: Given value null does not match the expected primitive type.");
                        }

                    } else {

                        if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) {
                            return null;
                        } else {
                            throw new Error("\tReason: Given value null does not match the expected object type.");
                        }

                    }

                }

                // Check for primitive matches
                if (
                    (expectedType === String && typeof (value) === "string") ||
                    (expectedType === Number && typeof (value) === "number") ||
                    (expectedType === Boolean && typeof (value) === "boolean")
                ) {
                    return value;
                } else {
                    if (this.ignorePrimitiveChecks) return value;
                    throw new Error("\tReason: Given value type does not match the expected primitive type.");
                }

            }

        }

        console.log("---------2");
        console.log(expectedDimension);
        console.log(expectedType);
        console.log(valueDimension);
        console.log(value);

        // All other attempts are fatal
        throw new Error("\tReason: Mapping failed because of an unknown error.");

/*
        // Map immediately if we don't care about the type
        if (expectedJsonType === Any || expectedJsonType === null || expectedJsonType === Object) {
            return value;
        }

        // Map the property to null if necessary
        if (value === undefined && this.mapUndefinedToNull) {
            value = null;
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

                if (serialize) return this.serializeObject(value, expectedJsonType);
                else return this.deserializeObject(value, expectedJsonType);

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

        // Check if expected was n-d
        if (expectedJsonType instanceof Array) {
            if (value === null) {
                if (this.valueCheckingMode !== ValueCheckingMode.DISALLOW_NULL) return null;
                else throw new Error("\tReason: Given value is null.");
            }

            // Check that value is not primitive
            if (value instanceof Object) {
                let array: any[] = [];

                // No data given, so return empty value
                if (value.length === 0) {
                    return array;
                }

                // We obviously don't care about the type, so return the value as is
                if (expectedJsonType.length === 0) {
                    return value;
                }
                // Copy the expectedJsonType array so we don't change the class-level mapping based on the value of this property
                const jsonType: any[] = expectedJsonType.slice(0);

                // Check if attempt was n-d
                if (value instanceof Array) {

                    // Loop through the data. Both type and value are at least of length 1
                    let autofillType: boolean = jsonType.length < value.length;
                    for (let i = 0; i < value.length; i++) {

                        if (autofillType && i >= jsonType.length) {
                            jsonType[i] = jsonType[i - 1];
                        }

                        array[i] = this.verifyProperty(jsonType[i], value[i], serialize);

                    }

                    return array;

                // Otherwise attempt was 1-d
                } else {

                    // Loop through the data. Both type and value are at least of length 1
                    let autofillType: boolean = jsonType.length < Object.keys(value).length;
                    let i = 0;
                    for (let key in value) {

                        if (autofillType && i >= jsonType.length) {
                            jsonType[i] = jsonType[i - 1];
                        }

                        array[key as any] = this.verifyProperty(jsonType[i], value[key]);

                        i++;
                    }

                    return array;

                }

            } else {
                throw new Error("\tReason: Expected type is array, but given value is primitive.");
            }
        }

        // Check if attempt was n-d and expected as 1-d
        if (value instanceof Array) {
            throw new Error("\tReason: Given value is array, but expected a non-array type.");
        }

        // All other attempts are fatal
        throw new Error("\tReason: Mapping failed because of an unknown error.");
*/
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
            }, {} as any);

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
            } else if (typeof expectedJsonType === "function") {
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

}
