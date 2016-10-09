# json2typescript

In Angular 2 applications, everyone consumes json API's from an external source. 
Type checking and object mapping is only possible in TypeScript, but not in the JavaScript runtime.
As the API may change at any point, it is important for larger projects to verify the consumed data.

**json2typescript** is a small package containing a helper class that maps json objects to an instance of a TypeScript class. 
After compiling to JavaScript, the result will still be an instance of this class.

With **json2typescript**, only a simple function call is necessary, as demonstrated in this TypeScript snippet:

```javascript
// Assume that you have a class named User defined at some point
// Assume that you get a json string from a webservice
let str: string = ...;

// Now you can map the string to the object automatically
let user: User = JsonConvert.deserializeString(str, User);
console.log(user); // prints User{ ... } in JavaScript runtime, not Object{ ... }
```

---

# Changelog

* v0.9.2: Added method `serializeString()` and changed `property` names and behaviour
* v0.9.1: First version released to the public

---

# Getting started

## Dependencies and requirements

We developed **json2typescript** for Angular2. In this document, we only cover this use case. However, you may use our package for pure TypeScript or even JavaScript applications.

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

## Setup a Test Application

We recommend to use the official **angular-cli** tool in order to set up a new Angular project. Then, all you need to do is type the following into your operating system's terminal:

```sh
ng new testApplication
cd testApplication

npm install json2typescript
```
Now you are ready to use the package.

## Basic example

In order to use the **json2typescript** package, all you need to do is write decorators into your classes. Start by adding

```typescript
@JsonObject
export class Country {
...
}
```

infront of your class declaration. Add for every property that should be filled with json data a decorator as well:

```typescript
// JsonProperty("jsonPropertyKey", "ClassToMap")
@JsonProperty("city", City)
public city: City = undefined;
```
The decorator allows you to map a json property to this classProperty.

##### Explanations

* Make sure you define `jsonPropertyKey`, `ClassToMap` as accurate as possible, even if you expect primitive types
* The `jsonPropertyKey` is the key to the value that should be mapped from the json object
* Make sure the `type` in the TypeScript property matches the class (here: `City`)
* Make sure you set the property to `undefined`, otherwise the mapping will **not** work

##### Notes about the ClassToMap

* `ClassToMap` should be `String`, `Number`, `Boolean`, `YourCustomClass` (for example: `City`) or `undefined` (to allow anything)
* You can allow arrays by using the bracket notation combined with the types before. For example: `[String]` for a string array
* Mixing arrays is allowed. For example: `[String,Number]` for an array where the first entry is a string, the second is a number. If the real array is longer than indicated here, the last type will be forced (here: `Number`). 
* This means, `[String,Number]` is equal to `[String,Number,Number]` and so on
* Nesting arrays and objects are allowed. For example: `[[String, Number], Boolean]`
* As further example, `[[String]]` is equal to `[[String],[String]]` which is equal to  `[[String,String], [String,String]]` and so on


Assuming you have created the **testApplication** and installed **json2typescript** as suggested above, create a class in a new file **city.ts** with the following content:

```typescript
import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject
export class City {

    @JsonProperty("name", String)
    public name: string = undefined;
    
    @JsonProperty("age", Number)
    public age: number = undefined;
    
    @JsonProperty("beautiful", Boolean)
    public beautiful: boolean = undefined;
    
    public printInfo() {
        if (this.beautiful)
            console.log(this.name + " was founded " + this.age + " years ago and is really beautiful!");
        else
            console.log(this.name + " was founded " + this.age + " years ago.");
    }
    
}
```

Then navigate to the file **app.component.ts** and add the following code:

```sh
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
        // Define a json string (could come from a HTTP service)
        let jsonString = '{ "name": "Basel", "age": 2200, "beautiful": true }';
        
        // Map to the city class
        let city: City;
        try {
            city = JsonConvert.deserializeObject(jsonString, City);
            city.printInfo(); // prints: Basel was founded 2200 years ago and is really beautiful!
        } catch (e) {
            console.log((<Error>e));
        }
}
```


---

# Detailed reference

## Class and property decorators

Decorators should be used whenever you would like to assign a json value to a TypeScript class instance property.

### Class decorators

The class decorators are used infront of the class declaration and do not support any parameters:

```javascript
@JsonObject
export class User {}
```

Tip: Make sure you import `JsonObject` from `json2typescript`.

### Property decorators

The property decorators are a vital part for type checking. It is important that the type in the decorator matches the TypeScript type.

```javascript
@JsonObject
export class User {
    @JsonProperty("jsonKeyOfName", String)
    public name: string = undefined;
}
```

Note: You must assign any value or `undefined` to your property, otherwise our mapper does **not** work.

The first parameter of `@JsonProperty` is the json object key. 
It happens that the keys given by the server are very ugly.
Here you can map any key to the `User` property `name`.
In our case, `json[jsonKeyOfName]` gets mapped to `user[name]`

The second parameter of `@JsonProperty` is the expected type. 
Make sure you pass the class name.
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

At first, the array notation on the left looks odd. 
But this notation allows you to define expected nested arrays. 
See the examples at the end of this document for more info.

#### Important general notes

* Make sure you define the expected type as accurate as possible, even if you expect primitive types.
* By default, casting primitives into other primitives is not allowed. Check the public properties below in this document this.
* By default, primitives are not allowed to be null. Check the public properties below in this document to change this.
* If you don't know the type, you may use `undefined` as expected type. You may also omit the second parameter of `@JsonProperty`.


#### Array syntax

* You can allow arrays by using the bracket notation combined with the types before. For example: `[String]` for a string array
* Mixing arrays is allowed. For example: `[String,Number]` for an array where the first entry is a string, the second is a number.
* If the real array is longer than indicated here, the last type will be forced to the rest of the array entries (above: `Number`). 
* This means, `[String,Number]` is equal to `[String,Number,Number]` and so on
* Nesting arrays and objects are allowed. For example: `[[String, Number], Boolean]`
* As further example, `[[String]]` is equal to `[[String],[String]]` which is equal to  `[[String,String], [String,String]]` and so on.

Tip: See the examples at the end of this document for advanced examples for nesting arrays.

## JsonConvert class properties and methods

### Public properties

`(bool) JsonConvert.debugMode`

Determines whether debugging info is shown in console when parsing a json object. 
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
However, the TypeScript team suggests you to avoid null values.
If your JSON api doesn't return null values, you should try the last flag disallowing null values.

### Public methods

`(string) public static serializeObject(instance: Object)`

Tries to serialize a JavaScript object to a json string.


`(any) public static deserializeString(jsonString: string, classObject: { new(): any })`

Tries to deserialize a json string to a TypeScript class.

`(any) public static deserializeObject(jsonObject: Object, classObject: { new(): any })`

Tries to deserialize a json object to a TypeScript class.


---

# Examples

## Nesting arrays

It is heavily discouraged to use nested arrays in a JSON api. 
If you need them anyway, here is how you have to define the types:

### 1) Nested arrays with same type

In the following example, `jsonKeyOfWeirdKeywords` is a key in the json object defined like this:

```JSON
{
    "jsonKeyOfWeirdKeywords": [
        ["Hello", "World"],
        ["Bye", "Earth"]
    ]
}
```

As we have an array of array of strings, you can define the expected type like this:

```javascript
@JsonObject
export class User {
    @JsonProperty("jsonKeyOfWeirdKeywords", [[String, String], [String, String]])
    public keywords: any = undefined;
}
```

Tip: In our syntax, `[[String, String], [String, String]]` is equivalent to `[[String], [String]]` and `[[String]]`.

### 2) Nested array with mixed depth and type

In the following example, `jsonKeyOfWeirdKeywords` is a key in the json object defined like this:

```JSON
{
    "jsonKeyOfWeirdKeywords": [
        ["FC", "Basel"],
        1893
    ]
}
```

You can define the expected type in your class like this:

```javascript
@JsonObject
export class User {
    @JsonProperty("jsonKeyOfWeirdKeywords", [[String, String], Number])
    public keywords: any = undefined;
}
```

Tip: In our syntax, `[[String, String], Number]` is equivalent to `[[String], Number]`.


---

# Imprint

This package was created by the **Digital Humanities Lab** of **University of Basel** in 2016.
We make use of it in our new website of 
http://www.salsah.org.

More information on 
http://dhlab.unibas.ch.

















**Example**:
```sh
let jsonObject = { "name": "json2typescript", "keywords": ["Json", "TypeScript"] };
let jsonString: string = JsonConvert.serializeObject(jsonObject);
console.log(jsonString);
```
**Example**:

Setup a class in a new file **user.ts** with the following content:
```sh
import {JsonObject, JsonProperty} from "./json-convert";

@JsonObject
export class User {

    @JsonProperty("name", String)
    public name: string = undefined;
    
    @JsonProperty("friend", User)
    public user: User = undefined;

    greeting() {
        console.log("Hello " + this.name + ", your friend is called " + this.user.name + "!");
    }

}
```

Add the following code somwhere into **app.component.ts** so that it is executed:

```sh
// Define a json string (could come from a HTTP service)
let jsonString = '{ "name": "Json", "friend": { "name": "TypeScript", "friend": null } }';

// Map to the user class
let user: User;
try {
    user = JsonConvert.deserializeObject(jsonString, User);
    user.greeting(); // prints: Hello Json, your friend is called TypeScript!
} catch (e) {
    console.log((<Error>e));
}
```
