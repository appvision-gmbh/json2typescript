import { JsonObject, JsonProperty } from "../../../src/json2typescript/json-convert-decorators";
import { Human } from "./human";

@JsonObject("Snacky")
export class Snake {

    @JsonProperty("snakeName", String)
    name: string = "";

    @JsonProperty()
    district: number = 0;  

    @JsonProperty("owner", Human)
    owner: Human = undefined;

}