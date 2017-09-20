import "reflect-metadata";
export declare class MetadataTool<T> {
    metadataKey: string;
    constructor(metadataKey: string);
    get(target: any): any;
    getOwn(target: any): any;
    hasOwn(target: any): boolean;
    set(value: T, target: any): void;
}
export declare namespace Settings {
    const mapping: MetadataTool<any>;
    const mapper: MetadataTool<any>;
    const propertyClass: MetadataTool<any>;
}
export declare class MappingOptions {
    classPropertyName: string;
    jsonPropertyName: string;
    expectedJsonType?: string;
    isOptional: boolean;
    customConverter: any;
}
