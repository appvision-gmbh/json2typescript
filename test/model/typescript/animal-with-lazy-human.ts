import { JsonObject, JsonProperty } from "../../../src/json2typescript/json-convert-decorators";

import type { Human } from "./human";

@JsonObject("AnimalWithLazyHuman")
export class AnimalWithLazyHuman {

    @JsonProperty("name", String)
    name: string = "";

    @JsonProperty("owner", "Human", true)
    owner: Human | null = null;

    getOwnerName(): string {
        return this.owner ? this.owner.firstname : "";
    }

}
