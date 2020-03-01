import { JsonConverter } from "../../../src/json2typescript/json-convert-decorators";
import { JsonCustomConvert } from "../../../src/json2typescript/json-custom-convert";

@JsonConverter
export class DateConverter implements JsonCustomConvert<Date | null> {
    serialize(date: Date | null): any {
        if (date instanceof Date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getUTCDate();
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        } else {
            return null;
        }
    }

    deserialize(date: any): Date | null {
        if (date === null || date === "") return null;
        return new Date(date);
    }
}
