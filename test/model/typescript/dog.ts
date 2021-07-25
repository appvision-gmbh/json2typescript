import {JsonObject, JsonProperty} from "../../../src/json2typescript/json-convert-decorators";

import {Animal} from "./animal";

@JsonObject("Doggy")
export class Dog extends Animal {

    @JsonProperty("barking", Boolean)
    isBarking: boolean = false;

    @JsonProperty("other", Number)
    other: number = 0;

    @JsonProperty("toys", [String], true)
    toys: string[] = [];

}
