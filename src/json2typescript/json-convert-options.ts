import "reflect-metadata";

export class MetadataTool<T> {
    constructor(public metadataKey: string) {
    }
    get(target: any): T | undefined {
        return Reflect.getMetadata(this.metadataKey, target);
    }
    getOrFail(target: any): T {
        const result = this.get(target);
        if (result == null) {
            throw new Error("MetadataTool.getOrFail: no data found for key (" + this.metadataKey + ")");
        }
        return result;
    }
    getOrInit(target: any, defaultValue: () => T): T {
        let result = this.get(target);
        if (result == null) {
            result = defaultValue();
            this.set(result, target);
        }
        return result;
    }
    getOwnOrInit(target: any, defaultValue: () => T): T {
        let result = this.getOwn(target);
        if (result == null) {
            result = defaultValue();
            this.set(result, target);
        }
        return result;
    }
    getOwnOrInitFromAncestors(target: any, defaultValue: (firstAncestorValue: T | undefined | null) => T): T {
        let result = this.getOwn(target);
        if (result == null) {
            let ancestorValue = this.get(target);
            result = defaultValue(ancestorValue);
            this.set(result, target);
        }
        return result;
    }
    getOwn(target: any): T | undefined {
        return Reflect.getOwnMetadata(this.metadataKey, target);
    }
    hasOwn(target: any): boolean {
        return Reflect.hasOwnMetadata(this.metadataKey, target);
    }
    set(value: T, target: any): void {
        Reflect.defineMetadata(this.metadataKey, value, target);
    }
}

/**
 * Internal constants.
 */
export namespace Settings {
    export const mapping = new MetadataTool<any>("__jsonconvert__mapping__");
    export const mapper = new MetadataTool<any>("__jsonconvert__mapper__");
    export const propertyClass = new MetadataTool<any>("__jsonconvert__property_class__");
    export const classProperties = new MetadataTool<string[]>("__jsonconvert__class_properties__");
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