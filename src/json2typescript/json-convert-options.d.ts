export declare class MetadataTool<T> {
    metadataKey: string;
    constructor(metadataKey: string);
    get(target: any): T | undefined;
    getOrFail(target: any): T;
    getOrInit(target: any, defaultValue: () => T): T;
    getOwnOrInit(target: any, defaultValue: () => T): T;
    getOwnOrInitFromAncestors(target: any, defaultValue: (firstAncestorValue: T | undefined | null) => T): T;
    getOwn(target: any): T | undefined;
    hasOwn(target: any): boolean;
    set(value: T, target: any): void;
}
export declare namespace Settings {
    const mapping: MetadataTool<any>;
    const mapper: MetadataTool<any>;
    const propertyClass: MetadataTool<any>;
    const classProperties: MetadataTool<string[]>;
}
export declare class MappingOptions {
    classPropertyName: string;
    jsonPropertyName: string;
    expectedJsonType?: string;
    isOptional: boolean;
    customConverter: any;
}
