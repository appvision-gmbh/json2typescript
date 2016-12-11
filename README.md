# json2typescript

In Angular 2 applications, everyone consumes JSON API's from an external source. 
Type checking and object mapping is only possible in TypeScript, but not in the JavaScript runtime.
As the API may change at any point, it is important for larger projects to verify the consumed data.

**json2typescript** is a small package containing a helper class that maps JSON objects to an instance of a TypeScript class. 
After compiling to JavaScript, the result will still be an instance of this class.

With **json2typescript**, only a simple function call is necessary, as demonstrated in this TypeScript snippet:

```typescript
// Assume that you have a class named User defined at some point
// Assume that you get a JSON string from a webservice
let str: string = ...;

// Now you can map the string to the object automatically
let user: User = JsonConvert.deserializeString(str, User);
console.log(user); // prints User{ ... } in JavaScript runtime, not Object{ ... }
```

---

# Changelog

* v0.9.5: New method for deserializing array of objects.
* v0.9.4: Class properties are now not overridden to `undefined` if there is no decorator and no matching json value.
* v0.9.3: It is now possible to map an JSON object to an TypeScript array, then the object keys become the array keys. Also, class properties can be set to optional. See below in the chapter "decorators" for more information.
* v0.9.2: Added method `serializeString()`, changed `property` names and behaviour
* v0.9.1: First version released to the public

---

# Getting started

## Requirements

We developed **json2typescript** for Angular2. In this document, we only cover this use case. However, you may use our package for pure TypeScript or even JavaScript applications.

## Setup a Test Application

We recommend to use the official **angular-cli** tool in order to set up a new Angular project. Then, all you need to do is type the following into your operating system's terminal:

```sh
ng new testApplication
cd testApplication

npm install json2typescript
```

Our package makes use of TypeScript decorators. Please activate them in your **tsconfig.json** under `compilerOptions` as follows:

```json
{
  "compilerOptions": {
    [...]
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    [...]
}
```

Now you are ready to use the package.

## Mapping example

In order to use the **json2typescript** package, all you need to do is write decorators and import the package. The following things need to be done if you would like to map JSON to existing classes:

* Classes need to be preceeded by `@JsonObject`
* Properties need to be preceeded by `@JsonProperty(key, Type)`
* Properties need to have a default value (or undefined), otherwise the mapper will not work

See below an example so you can learn from it how **json2typescript** works best.

Assuming that you have created the **testApplication** in the step before and installed **json2typescript** as suggested, create a class in a new file **city.ts** with the following content:

```typescript
import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject
export class City {

    // This property has no @JsonProperty. 
    // It will only be mapped if our JSON object contains a key named "id".
    // If there is no such element, no exception is thrown.
    // There will be no type checking at all.
    public id: number = undefined; // <- assign a value or undefined to enable the mapper!

    // This maps the value of the JSON key "name" to the class property "name".
    // If the JSON value is not of type string (or missing), there will be an exception.
    @JsonProperty("name", String)
    public name: string = undefined;
    
    // This maps the JSON key "founded" to the private class property "_founded".
    // Note the use of public getter and setter.
    // If the JSON value is not of type number (or missing), there will be an exception.
    @JsonProperty("founded", Number)
    private _founded: number = undefined;
    public get founded() { return this._founded; }
    public set founded(value: number) { this._founded = value; }
    
    // This maps the JSON key "beautiful" to the class property "beautiful".
    // If the JSON value is not of type boolean (or missing), there will be an exception.
    @JsonProperty("beautiful", Boolean)
    public beautiful: boolean = undefined;
    
    // This maps the JSON key "data" to the class property "data".
    // We are not sure about the type, so we omit the second parameter.
    // There will be an exception if the JSON value is missing.
    @JsonProperty("data") // is the same as @JsonProperty("data", undefined)
    public data: any = undefined;
    
    // This maps the JSON key "keywords" to the class property "keywords".
    // This is an example of a string array. Note our syntax "[String]".
    // In the further examples at the end of this document, you can see how to nest complex arrays.
    @JsonProperty("keywords", [String])
    public keywords: string[] = undefined; // or Array<string>
    
    public printInfo() {
        if (this.beautiful)
            console.log(this.name + " was founded in " + this.founded + " and is really beautiful!");
        else
            console.log(this.name + " was founded in " + this.founded + ".");
    }
    
}
```

Now create a file **country.ts** with the following content:

```typescript
import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject
export class Country {

    // This maps the value of the JSON key "countryName" to the class property "name".
    // If the JSON value is not of type string (or missing), there will be an exception.
    @JsonProperty("countryName", String)
    public name: string = undefined;
    
    // This maps the value of the JSON key "cities" to the class property "cities".
    // If the JSON value is not of type array object (or missing), there will be an exception.
    // There will be an exception too if the objects in the array do not match the class "City".
    @JsonProperty("cities", [City])
    public cities: City[] = undefined;
    
}
```

Then navigate to the file **app.component.ts** and add the following code:

```typescript
import { Component } from '@angular/core';
import { JsonConvert } from "json2typescript"
import { City } from "./city";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    ngOnInit() {
        // Define a JSON string (could come from a HTTP service)
        let jsonString = `
        { 
            "countryName": "Switzerland", 
            "cities": [
                { 
                    "id": 1, 
                    "name": "Basel", 
                    "founded": -200, 
                    "beautiful": true, 
                    "data": 123,
                    "keywords": ["Rhine", "River"] 
                },
                { 
                    "id": 1, 
                    "name": "Zurich", 
                    "founded": 0, 
                    "beautiful": false, 
                    "data": "no",
                    "keywords": ["Limmat", "Lake"] 
                }
            ]
        }`;
        
        // Choose your settings
        // Check the detailed reference in the chapter "JsonConvert class properties and methods"
        JsonConvert.debugMode = true; // print some debug data
        JsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
        JsonConvert.valueCheckingMode = JsonConvert.ValueCheckingMode.DISALLOW_NULL; // never allow null
        
        // Map to the country class
        let country: Country;
        try {
            country = JsonConvert.deserializeString(jsonString, Country);
            country.cities[0].printInfo(); // prints: Basel was founded in -200 and is really beautiful!
        } catch (e) {
            console.log((<Error>e));
        }
}
```
Play around with the JSON to provocate exceptions when deserializing the string.

# Detailed reference

## Class and property decorators
Decorators should be used whenever you would like to assign a JSON value to a TypeScript class instance property.

### Class decorators

The class decorators are used infront of the class declaration and do not support any parameters:

```typescript
@JsonObject
export class User {}
```

> Tip: Make sure you import `JsonObject` from `json2typescript`.

### Property decorators

Property decorators are a vital part for type checking. It is important that the type in the decorator matches the TypeScript type.

```typescript
@JsonObject
export class User {
    @JsonProperty("jsonKeyOfName", String, false)
    public name: string = undefined;
}
```

Note: You must assign any value or `undefined` to your property at initialization, otherwise our mapper does **not** work.

#### First parameter: jsonKey

The first parameter of `@JsonProperty` is the JSON object key. 
It happens that the keys given by the server are very ugly.
Here you can map any key to the `User` property `name`.
In our case, `json[jsonKeyOfName]` gets mapped to `user[name]`.

#### Second parameter (optional): expectedType

The second parameter of `@JsonProperty` is the expected type.
This parameter is optional; the default value is undefined (which allows any type).
Make sure you pass the class name and not an instance of the class.
In case of primitive types, you have to use the upper case names. 
See the following cheat sheet for reference:

| Expected type             | TypeScript type       |
| ---                       | :---                  |
| String                    | string                |
| Number                    | number                |
| Boolean                   | boolean               | 
| User                      | User                  |
| undefined                 | any                   |
|                           |                       | 
| [String]                  | string[]              | 
| [Number]                  | number[]              |
| [Boolean]                 | boolean[]             | 
| [User]                    | User[]                | 
| [undefined] or []         | any[]                 | 

At first, our array notation on the left looks odd. 
But this notation allows you to define even nested arrays. 
See the examples at the end of this document for more info about nesting arrays.

#### Third parameter (optional): isOptional

The third parameter of `@JsonProperty` determines whether the `jsonKey` has to be present in the json.
This parameter is optional; the default value is false.
By default, `JsonConvert` throws an exception if a decorated class property cannot be found in the given JSON.
If you set the third parameter to true, there is no exception when it is missing. 
The type is still checked as soon the property is present again.

#### Important notes

* Make sure you define the expected type as accurate as possible, even if you expect primitive types.
* By default, casting primitives into other primitives is not allowed. Check the public properties below in this document to change this behaviour.
* By default, primitives are not allowed to be null. Check the public properties below in this document to change this.
* If you don't know the type, you may use `undefined` as expected type. You may also omit the second parameter of `@JsonProperty`.

#### More about the array syntax

* You can allow arrays by using the bracket notation combined with the types as seen above. For example: `[String]` for a string array
* Mixing arrays is allowed. For example: `[String, Number]` for an array where the first entry is a string, the second is a number.
* If the real array is longer than indicated here, the last type will be forced to the rest of the array entries (above: `Number`). 
* This means, `[String, Number]` is equivalent to `[String, Number, Number]` and so on.
* Nesting arrays and objects are allowed. For example: `[[String, Number], User]`.
* This is equivalent to `[[String, Number, Number], User, User]` and so on.
* As further example, `[[String]]` is equal to `[[String],[String]]` which is equal to  `[[String,String], [String,String]]` and so on.
* If an array has less elements as given in the expected type, no exception is thrown.
* For example, if we define `[String]` or the equivalent `[String, String]` no exception is thrown - even if the JSON gives us an empty array.

> Tip: See the examples at the end of this document for advanced examples for nesting arrays.

## JsonConvert class properties and methods

### Public properties

`(bool) JsonConvert.debugMode`

Determines whether debugging info is shown in console when parsing a JSON object. 
The default value is `false`.

`(bool) JsonConvert.ignorePrimitiveChecks`

Determines whether primitive types should be checked. 
If true, it will be allowed to assign primitive to other primitive types.
The default is `false`.

`(bool) JsonConvert.valueCheckingMode`

Determines which types are allowed to be null.
You may assign three different values:
* `JsonConvert.ValueCheckingMode.ALLOW_NULL`: All given values can be null.
* `JsonConvert.ValueCheckingMode.ALLOW_OBJECT_NULL`: Objects can be null, but primitive types cannot be null.
* `JsonConvert.ValueCheckingMode.DISALLOW_NULL`: No null values are tolerated.

The default is `JsonConvert.ValueCheckingMode.ALLOW_OBJECT_NULL`. 

> Tip: The TypeScript developer team suggests you to avoid null values. If your JSON api doesn't return null values, you should try the last flag disallowing null values.

### Public methods

`(string) public static serializeObject(instance: Object)`

Tries to serialize a JavaScript object to a JSON string.


`(any) public static deserializeString(jsonString: string, classObject: { new(): any })`

Tries to deserialize a JSON string to a TypeScript class.

`(any) public static deserializeObject(jsonObject: Object, classObject: { new(): any })`

Tries to deserialize a JSON object to a TypeScript class.


---

# Further examples

In case you don't have enough complex examples yet, you may find some more in this section.

## Nesting arrays

It is heavily discouraged to use nested arrays and use different types in a JSON api. 
If you need them anyway, here is how you have to define the types:

### 1) Nested arrays with same type

In the following example, `jsonKeyOfWeirdKeywords` is a key in the JSON object defined like this:

```JSON
{
    "jsonKeyOfWeirdKeywords": [
        ["Hello", "World"],
        ["Bye", "Earth"]
    ]
}
```

As we have an array of array of strings, you can define the expected type like this:

```typescript
@JsonObject
export class User {
    @JsonProperty("jsonKeyOfWeirdKeywords", [[String, String], [String, String]])
    public keywords: any = undefined;
}
```

> Tip: In our syntax, `[[String, String], [String, String]]` is equivalent to `[[String], [String]]` and `[[String]]`. That is because the last type in an array will be automatically repeated as much as needed.

### 2) Nested array with mixed depth and type

In the following example, `JSONKeyOfWeirdKeywords` is a key in the JSON object defined like this:

```JSON
{
    "jsonKeyOfWeirdKeywords": [
        ["FC", "Basel"],
        1893
    ]
}
```

You can define the expected type in your class like this:

```typescript
@JsonObject
export class User {
    @JsonProperty("jsonKeyOfWeirdKeywords", [[String, String], Number])
    public keywords: any = undefined;
}
```

> Tip: In our syntax, `[[String, String], Number]` is equivalent to `[[String], Number]`.

---

# Imprint

This package was created by the **Digital Humanities Lab** of **University of Basel** in 2016.
We make use of it in our new website of 
http://www.salsah.org.

More information on 
http://dhlab.unibas.ch