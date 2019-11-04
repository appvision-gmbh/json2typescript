import {JsonObject, JsonProperty} from "../../../src/json2typescript/json-convert-decorators";

import {Animal} from "./animal";

@JsonObject
export class Dog extends Animal {

    @JsonProperty("secName", String, true)
    secondName?: string = undefined;

    @JsonProperty("barking", Boolean)
    isBarking: boolean = false;

    @JsonProperty("other", Number)
    other: number = 0;

}