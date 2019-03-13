import { Animal } from './animal';
import { JsonObject } from '../../../src/json2typescript/json-convert-decorators';

/**
 * Class which has a property with the same name as Cat.  Used to test handling
 * of prototype-based property mapping search.  Property has the same name, but
 * an incompatible type, and is initialized (so it's present) but purposely left
 * unmapped, so it shouldn't be serialized or deserialized.
 */
@JsonObject("DuplicateCat")
export class DuplicateCat extends Animal {

  // Leave property with the same name unmapped so there's no direct mapping, but use an incompatible type
  district: Date | undefined = undefined;
}
