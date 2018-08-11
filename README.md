# json2typescript

In Angular 2 applications, everyone consumes JSON API's from an external source. 
Type checking and object mapping is only possible in TypeScript, but not in the JavaScript runtime.
As the API may change at any point, it is important for larger projects to verify the consumed data.

**json2typescript** is a small package containing a helper class that maps JSON objects to an instance of a TypeScript class. 
After compiling to JavaScript, the result will still be an instance of this class. One big advantage of this approach is, that you can  also use methods of this class.

With **json2typescript**, only a simple function call is necessary, as demonstrated in this TypeScript snippet:

```typescript
// Assume that you have a class named User defined at some point
// Assume that you get a JSON string from a webservice
let jsonStr: string = ...;
let jsonObj: object = JSON.parse(jsonStr);

// Now you can map the json object to the TypeScript object automatically
let jsonConvert: JsonConvert = new JsonConvert();
let user: User = jsonConvert.deserializeObject(jsonObj, User);
console.log(user); // prints User{ ... } in JavaScript runtime, not Object{ ... }
```

> Tip: All `serialize()` and `deserialize()` methods may throw an exception in case of failure. Make sure you catch the errors in production!

---

# Changelog

See the changelog in the seperate file for bug fixes, new features and breaking changes: [Changelog](CHANGELOG.md)

> Tip: Starting from version 1.0.6, we recommend to use unique class identifiers in the `@JsonObject` decorator. Read below how to use the decorators properly.

> Tip: Version 1.0.0 has several breaking changes. When upgrading from `json2typescript` < 1.0.0, please make sure you fix these issues.

---

# Getting started

## Requirements

We developed **json2typescript** for Angular 2+. In this document, we only cover this use case. However, you may use our package for pure TypeScript or even JavaScript applications.

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

* Classes need to be preceeded by `@JsonObject(classIdentifier)`
* Properties need to be preceeded by `@JsonProperty(jsonProperty, conversionOption, isOptional)`
* Properties need to have a default value (or undefined), otherwise the mapper will not work

See below an example so you can learn from it how **json2typescript** works best.

Assuming that you have created the **testApplication** in the step before and installed **json2typescript** as suggested, create a class in a new file **city.ts** with the following content:

```typescript
import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject("City")
export class City {

    // This property has no @JsonProperty. 
    // It will not be mapped.
    id: number = 123;

    // This maps the value of the JSON key "name" to the class property "name".
    // If the JSON value is not of type string (or missing), there will be an exception.
    @JsonProperty("name", String)
    name: string = undefined;
    
    // This maps the JSON key "founded" to the private class property "_founded".
    // Note the use of public getter and setter.
    // If the JSON value is not of type number (or missing), there will be an exception.
    @JsonProperty("founded", Number)
    private _founded: number = undefined;
    get founded() { return this._founded; }
    set founded(value: number) { this._founded = value; }
    
    // This maps the JSON key "beautiful" to the class property "beautiful".
    // If the JSON value is not of type boolean (or missing), there will be an exception.
    @JsonProperty("beautiful", Boolean)
    beautiful: boolean = undefined;
    
    // This maps the JSON key "data" to the class property "data".
    // We are not sure about the type, so we omit the second parameter.
    // There will be an exception if the JSON value is missing.
    @JsonProperty("data") // is the same as @JsonProperty("data", Any)
    data: any = undefined;
    
    // This maps the JSON key "keywords" to the class property "keywords".
    // This is an example of a string array. Note our syntax "[String]".
    // In the further examples at the end of this document, you can see how to nest complex arrays.
    @JsonProperty("keywords", [String])
    keywords: string[] = undefined; // or Array<string>
    
    printInfo() {
        if (this.beautiful)
            console.log(this.name + " was founded in " + this.founded + " and is really beautiful!");
        else
            console.log(this.name + " was founded in " + this.founded + ".");
    }
    
}
```

Now create a file **country.ts** with the following content:

```typescript
import {City} from "./city";
import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject("Country")
export class Country {

    // This maps the value of the JSON key "countryName" to the class property "name".
    // If the JSON value is not of type string (or missing), there will be an exception.
    @JsonProperty("countryName", String)
    name: string = undefined;
    
    // This maps the value of the JSON key "cities" to the class property "cities".
    // If the JSON value is not of type array object (or missing), there will be an exception.
    // There will be an exception too if the objects in the array do not match the class "City".
    @JsonProperty("cities", [City])
    cities: City[] = undefined;
    
}
```

Then navigate to the file **app.component.ts** and add the following code:

```typescript
import {Component, OnInit} from '@angular/core';
import {JsonConvert, OperationMode, ValueCheckingMode} from "json2typescript"
import {Country} from "./country";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    ngOnInit() {
        // Define a JSON object (could come from a HTTP service, parsed with JSON.parse() if necessary)
        const jsonObject: object = { 
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
        };
        
        // Choose your settings
        // Check the detailed reference in the chapter "JsonConvert class properties and methods"
        let jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.operationMode = OperationMode.LOGGING; // print some debug data
        jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
        
        // Map to the country class
        let country: Country;
        try {
            country = jsonConvert.deserialize(jsonObject, Country);
            country.cities[0].printInfo(); // prints: Basel was founded in -200 and is really beautiful!
        } catch (e) {
            console.log((<Error>e));
        }
}
```
Play around with the JSON to provocate exceptions when deserializing the object.

## Important notes

Avoid circular depencencies on the classes that use `json2typescript`. Even if you don't have any errors in your IDE, `json2typescript` will not properly work in this case.

---

# Detailed reference

## Class and property decorators

Decorators should be used whenever you would like to map JSON with TypeScript data.

### Class decorators

The class decorators are used infront of the class declaration and do support one parameter:

```typescript
@JsonObject("User")
export class User {}
```

> Tip: Make sure you import `JsonObject` from `json2typescript`.

#### First parameter: classIdentifier (optional)

The first parameter of `@JsonObject` is meant to be a unique class identifier, usually just the class name.
In many applications, developers deploy minified code which also minifies class names. 
Adding a class identifier is highly recommended because it will prevent collision of class names.

### Property decorators

Property decorators are a vital part for type checking. It is important that the type in the decorator matches the TypeScript type.

```typescript
@JsonObject("User")
export class User {
    @JsonProperty("jsonPropertyName", String, false)
    name: string = undefined;
}
```

Important note: You must assign any (valid) value or `undefined` to your property at 
initialization, otherwise our mapper does **not** work.

> Tip: Make sure you import `JsonObject` and `JsonProperty` from `json2typescript`.

#### First parameter: jsonProperty

The first parameter of `@JsonProperty` is the JSON object property name. 
It happens that the property names given by the server are very ugly.
Here you can map any json property name to the `User` property `name`.
In our case, `json["jsonPropertyName"]` gets mapped to `user.name`.

#### Second parameter (optional): conversionOption

The second parameter of `@JsonProperty` describes what happens when doing the mapping between JSON and TypeScript objects.
This parameter is optional; the default value is `Any` (which means no type check is done when the mapping happens).

##### Use of expected type

If you would like that `json2typescript` performs an automatic type 
check according to given TypeScript types, you can pass a type you
expect. Follow the following guide when doing that:

- Make sure you pass the class name and not an instance of the class.
- In case of primitive types, you have to use the upper case names.
- In case of `any` type, import from `json2typescript` the class `Any`.

See the following cheat sheet for reference:

| Expected type             | TypeScript type       |
| ---                       | :---                  |
| String                    | string                |
| Number                    | number                |
| Boolean                   | boolean               | 
| User                      | User                  |
| Any                       | any                   |
|                           |                       | 
| [String]                  | string[]              | 
| [Number]                  | number[]              |
| [Boolean]                 | boolean[]             | 
| [User]                    | User[]                | 
| [Any]                     | any[]                 | 

At first, our array notation on the left looks odd. 
But this notation allows you to define even nested arrays. 
See the examples at the end of this document for more info about nesting arrays.

##### Adding a custom converter

More advanced users may need to use custom converters. If you don't want
`json2typescript` to use your custom converter, you need to follow these
steps:

- Write a converter class that implements `JsonCustomConvert<T>` where
`<T>` is the type resulting in the TypeScript class.
- Make sure you add the `@JsonConverter` decorator to this class (see next chapter how).
- Pass your converter class as second param in the `@JsonProperty` decorator

Assume you would like to transform `1893-11-15` (string from JSON) to a TypeScript
`Date` instance, then you would write a class `DateConverter` (see next chapter how)
and pass it as second param in `@JsonProperty` as below:

```typescript
@JsonObject("User")
export class User {
    @JsonProperty("birthdate", DateConverter)
    birthdate: Date = undefined;
}
```

#### Third parameter (optional): isOptional

The third parameter of `@JsonProperty` determines whether the `jsonProperty` has to be present in the json.
This parameter is optional; the default value is false.

By default, `JsonConvert` throws an exception if a decorated class property cannot be found in the given JSON when deserializing.
If you set the third parameter to true, there is no exception when it is missing. 
The type is still checked as soon the property is present again.

The same applies for the case when you try to serialize a TypeScript object to a JSON object. If the property is not defined in the class and optional, it will not be added to the JSON object.

#### Important notes

* Make sure you define the expected type as accurate as possible, even if you expect primitive types.
* By default, casting primitives into other primitives is not allowed. Check the public properties below in this document to change this behaviour.
* By default, primitives are not allowed to be null. Check the public properties below in this document to change this.
* If you don't know the type, you may use `Any` as expected type. You may also omit the second parameter of `@JsonProperty`.

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

### Custom converter decorators

In some cases, you may need to make custom conversion between JSON objects and TypeScript objects. You can define custom converters like this:


```typescript
@JsonConverter
class DateConverter implements JsonCustomConvert<Date> {
    serialize(date: Date): any {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +  date.getDate();
    }
    deserialize(date: any): Date {
        return new Date(date);
    }
}
```

> Tip: Make sure that you import `JsonConverter` from `json2typescript`. Also don't forget to use the same time between the brackets `<>`, as the `serialize()` param and `deserialize()` return value.

Assume that in your JSON you have a date in a standardized format, such as `2017-07-19 10:00:00`. You could use the custom converter class above to make sure it is stored as a real TypeScript `Date` in your class. For your property, you simply have use the `@JsonProperty` decorator as follows:


```typescript
@JsonObject("User")
export class User {
    @JsonProperty("date", DateConverter)
    date: Date = undefined;
}
```

With this approach, you will achieve that your property `date` is going to be a real instance of `Date`.



## JsonConvert class properties and methods

### Public properties

#### Operation mode

`(number) JsonConvert.operationMode`

Determines how the JsonConvert class instance should operate. 

You may assign three different values:
- `OperationMode.DISABLE`: json2typescript will be disabled, no type checking or mapping is done
- `OperationMode.ENABLE`: json2typescript is enabled, but only errors are logged
- `OperationMode.LOGGING`: json2typescript is enabled and detailed information is logged

The default value is `OperationMode.ENABLE`. It will only print errors to the console and is suited for production.

In some cases, you might consider disabling `json2typescript` in production by setting the `OperationMode.DISABLE` flag. 
This only works in case you only use plain objects without functionality and no mapping. 
However, disabling `json2typescript` might give you a performance disadvantage in heavy projects.

In case you have issues to find bugs, you can enable additional logging by setting the `OperationMode.LOGGING` flag.
Please note that every serializing and deserializing is heavily logged to the console and will make your application slower.
Never use this flag in production.

> Tip: Make sure you import the `ENUM` `OperationMode` when assigning a value to this property.

#### Value checking mode

`(number) JsonConvert.valueCheckingMode`

Determines which types are allowed to be null.
You may assign three different values:
* `ValueCheckingMode.ALLOW_NULL`: All given values can be null
* `ValueCheckingMode.ALLOW_OBJECT_NULL`: Objects can be null, but primitive types cannot be null
* `ValueCheckingMode.DISALLOW_NULL`: No null values are tolerated

The default is `ValueCheckingMode.ALLOW_OBJECT_NULL`. 

> Tip: Make sure you import the `ENUM` `ValueCheckingMode` when assigning a value to this property.

#### Ignore primitive checks

`(bool) JsonConvert.ignorePrimitiveChecks`

Determines whether primitive types should be checked. 
If true, it will be allowed to assign primitive to other primitive types.

The default is `false`.

> Tip: The TypeScript developer team suggests you to avoid null values. If your JSON api doesn't return null values, you should try the last flag disallowing null values.

### Public methods

`json2typescript` allows you to map JSON objects (or arrays) to TypeScript objects (or arrays) and vice versa.

#### Serializing (TypeScript to JSON)
 
`(any) serialize(data: any)`

Tries to serialize a TypeScript object or array of objects to JSON.

> Tip: The return value is not a string. In case you need a string as result, use `JSON.stringify()` after calling the serialize method.

#### Deserializing (JSON to TypeScript)
 
`(any) deserialize(json: any, classReference: { new(): any })`

Tries to deserialize given JSON to a TypeScript object or array of objects.

> Tip: The param `json` must not be a string, but an `object` or an `array`.  Use `JSON.parse()` before applying the deserialize method in case you have a json string.

#### Other methods

The methods `serialize()` and `deserialize()` will automatically detect the dimension of your param (either object or array).
In case you would like to force `json2typescript` to use a specific way, you can use the following methods instead:
- `(any) serializeObject(instance: any)`
- `(any[]) serializeArray(instanceArray: any[])`
- `(any) deserializeObject(jsonObject: any, classReference: { new(): any })`
- `(any[]) deserializeArray(jsonArray: any[], classReference: { new(): any })`

>

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
@JsonObject("User")
export class User {
    @JsonProperty("jsonKeyOfWeirdKeywords", [[String, String], [String, String]])
    keywords: any = undefined;
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
@JsonObject("User")
export class User {
    @JsonProperty("jsonKeyOfWeirdKeywords", [[String, String], Number])
    keywords: any = undefined;
}
```

> Tip: In our syntax, `[[String, String], Number]` is equivalent to `[[String], Number]`.

---

# Contributors

This NPM package was originally created by **Andreas Aeschlimann**, scientific researcher of the **Digital Humanities Lab** (DHlab) of **University of Basel** in 2016. 

The Digital Humanities Lab makes use of `json2typescript` in several Angular web applications, for example in the new website of http://www.salsah.org. You may find more information about us on http://dhlab.unibas.ch

## Special thanks

Thanks for the input and pull requests by:
- @gempain for fixing several issues and adding karma tests.
- @mrwogu for fixing the `noImplicitAny` issue.
- @bblommers for the support of multiple decorators.
- @archfz for fixing the constructor.name issue