/**
 * Internal constants.
 */
export class Settings {
    static readonly MAPPING_PROPERTY = "__jsonconvert__mapping__";
    static readonly MAPPER_PROPERTY = "__jsonconvert__mapper__";
    static readonly CLASS_IDENTIFIER = "__jsonconvert__class_identifier__";
};

/**
 * Internal mapping options for a property.
 */
export class MappingOptions {
    classPropertyName: string = "";
    jsonPropertyName: string = "";
    expectedJsonType?: string = undefined;
    isOptional: boolean = false;
    customConverter: any = null;
}
