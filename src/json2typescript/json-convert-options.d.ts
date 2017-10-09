export declare class Settings {
    static readonly MAPPING_PROPERTY: string;
    static readonly MAPPER_PROPERTY: string;
}
export declare class MappingOptions {
    classPropertyName: string;
    jsonPropertyName: string;
    expectedJsonType?: string;
    isOptional: boolean;
    customConverter: any;
}
