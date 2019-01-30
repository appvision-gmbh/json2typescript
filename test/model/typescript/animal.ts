import { JsonObject, JsonProperty } from "../../../src/json2typescript/json-convert-decorators";
import { Any } from "../../../src/json2typescript/any";

import { DateConverter } from "./date-converter";
import { Human } from "./human";

@JsonObject("Animal")
export class Animal {

    @JsonProperty("name", String)
    name: string = "";

    @JsonProperty("owner", Human, true)
    owner: Human | null = null;

    @JsonProperty("birthdate", DateConverter, true)
    birthdate: Date | null = null;

    @JsonProperty("friends", [Any], true)
    friends: any[] = [];

}