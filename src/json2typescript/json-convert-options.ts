import "reflect-metadata";

export class MetadataTool<T> {
    constructor(public metadataKey: string) {
    }
    get(target: any) {
        return Reflect.getMetadata(this.metadataKey, target);
    }
    getOwn(target: any) {
        return Reflect.getOwnMetadata(this.metadataKey, target);
    }
    hasOwn(target: any) {
        return Reflect.hasOwnMetadata(this.metadataKey, target);
    }
    set(value: T, target: any) {
        return Reflect.defineMetadata(this.metadataKey, value, target);
    }
}

/**
 * Internal constants.
 */
export namespace Settings {
    export const mapping = new MetadataTool<any>("__jsonconvert__mapping__");
    export const mapper = new MetadataTool<any>("__jsonconvert__mapper__");
    export const propertyClass = new MetadataTool<any>("__jsonconvert__property_class__");
}

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