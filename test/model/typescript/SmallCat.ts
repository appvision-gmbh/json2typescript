import {Cat} from './cat';
import {JsonObject} from '../../../src/json2typescript/json-convert-decorators';

@JsonObject("SmallCat")
export class SmallCat extends Cat {

}