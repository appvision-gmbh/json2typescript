import { JsonObject, JsonProperty } from "../../../src/json2typescript/json-convert-decorators";

import { Animal } from "./animal";

@JsonObject("OptionalKitty")
export class OptionalCat extends Animal {

    @JsonProperty("catName", String)
    name: string = "";

    @JsonProperty("districtNumber", Number)
    district?: number = undefined;

}
