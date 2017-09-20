export declare class JsonConvert {
    private _operationMode;
    operationMode: number;
    private _valueCheckingMode;
    valueCheckingMode: number;
    private _ignorePrimitiveChecks;
    ignorePrimitiveChecks: boolean;
    constructor(operationMode?: number, valueCheckingMode?: number, ignorePrimitiveChecks?: boolean);
    serialize(data: any): any;
    serializeObject(instance: any): any;
    serializeArray(instanceArray: any[]): any[];
    deserialize(json: any, classReference: {
        new (): any;
    }): any;
    deserializeObject(jsonObject: any, classReference: {
        new (): any;
    }): any;
    deserializeArray(jsonArray: any[], classReference: {
        new (): any;
    }): any[];
    private serializeObject_loopProperty(instance, classPropertyName, json);
    private deserializeObject_loopProperty(instance, classPropertyName, json);
    private getClassPropertyMappingOptions(instance, propertyName);
    private verifyProperty(expectedJsonType, value, serialize?);
    private getExpectedType(expectedJsonType);
    private getJsonType(jsonValue);
    private getTrueType(trueValue);
}
