import { JsonObject, JsonProperty } from "../../../src/json2typescript/json-convert-decorators";

import { Animal } from "./animal";

@JsonObject("Kitty")
export class Cat extends Animal {

    @JsonProperty("catName", String)
    name: string = "";

    @JsonProperty()
    district: number = 0;

    @JsonProperty()
    talky: boolean = false;

    @JsonProperty("other", String)
    other: string = "";

}