/**
 * Internal constants.
 */
export declare class Settings {
    static readonly MAPPING_PROPERTY: string;
    static readonly MAPPER_PROPERTY: string;
    static readonly CLASS_IDENTIFIER: string;
}
/**
 * Internal mapping options for a property.
 */
export declare class MappingOptions {
    classPropertyName: string;
    jsonPropertyName: string;
    expectedJsonType?: string;
    isOptional: boolean;
    customConverter: any;
}
