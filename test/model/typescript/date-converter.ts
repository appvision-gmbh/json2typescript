import { JsonConverter } from "../../../src/json2typescript/json-convert-decorators";
import { JsonCustomConvert } from "../../../src/json2typescript/json-custom-convert";

@JsonConverter
export class DateConverter implements JsonCustomConvert<Date | null> {
    serialize(date: Date | null): any {
        if (date instanceof Date) {
            // Convert to standard ISO format, which is in UTC
            const isoString = date.toISOString();
            // Split on the "T" separator and return just the date portion
            return isoString.split("T")[0];
        } else {
            return null;
        }
    }

    deserialize(date: any): Date | null {
        if (date === null || date === "") return null;
        return new Date(date);
    }
}
