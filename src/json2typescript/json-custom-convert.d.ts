export interface JsonCustomConvert<T> {
    serialize(data: T): any;
    deserialize(data: any): T;
}
