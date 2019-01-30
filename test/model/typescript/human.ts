import {JsonObject, JsonProperty} from "../../../src/json2typescript/json-convert-decorators";

@JsonObject()
export class Human {

    @JsonProperty("givenName", String)
    firstname: string = "";

    @JsonProperty("lastName", String)
    lastname: string = "";

    get name(): string {
        if (this.firstname.length > 0 && this.lastname.length > 0) {
            return this.firstname + " " + this.lastname;
        } else {
            return "";
        }
    }

    constructor() {}

}