import { JsonConvert } from "../src/json2typescript/json-convert";
import { ValueCheckingMode } from "../src/json2typescript/json-convert-enums";
import { IAnimal } from "./model/json/i-animal";
import { ICat } from "./model/json/i-cat";
import { IDog } from "./model/json/i-dog";
import { IDuplicateCat } from "./model/json/i-duplicate-cat";
import { IHuman } from "./model/json/i-human";
import { IOptionalCat } from "./model/json/i-optional-cat";
import { Animal } from "./model/typescript/animal";
import { AnimalHolder } from "./model/typescript/animal-holder";
import { Cat } from "./model/typescript/cat";
import { Dog } from "./model/typescript/dog";
import { DuplicateCat } from "./model/typescript/duplicate-cat";
import { Human } from "./model/typescript/human";
import { OptionalCat } from "./model/typescript/optional-cat";
import { AnimalWithLazyHuman } from "./model/typescript/animal-with-lazy-human";

describe("JsonConvert integration tests", () => {

    const jsonConvert = new JsonConvert();

    // JSON DATA
    let human1JsonObject: IHuman = {
        givenName: "Andreas",
        lastName: "Muster",
    };
    let cat1JsonObject: ICat = {
        catName: "Meowy",
        district: 100,
        owner: human1JsonObject,
        birthdate: "2016-01-01",
        friends: [],
        talky: false,
        other: "",
    };
    let dog1JsonObject: IDog = {
        name: "Barky",
        barking: true,
        birthdate: "2017-02-12",
        friends: [],
        other: 0,
        toys: ["pizza", "bone", "ball"],
    };
    let cat2JsonObject: ICat = {
        catName: "Links",
        district: 50,
        birthdate: "2016-05-19",
        talky: true,
        other: "",
    };
    let catPartialJsonObject: Partial<ICat> = {
        catName: "Meowy",
    };
    let dogPartialJsonObject: Partial<IDog> = {
        name: "Barky",
        barking: true,
    }
    let duplicateCat1SerializeJsonObject: IDuplicateCat = {
        name: "Duplicate",
        talky: "2015-02-03",
    };
    let animalHolderWithDogJsonObject: object = {
        $type: "AnimalHolder",
        name: "Laura",
        animal: {
            $type: "Doggy",
            name: "Barky",
            barking: true,
            birthdate: "2017-02-12",
            friends: [],
            other: 0,
            toys: ["pizza", "bone", "ball"]
        }
    };
    let differentAnimalsJsonArray: object[] = [
        {
            $type: "Doggy",
            name: "Barky",
            barking: true,
            birthdate: "2017-02-12",
            friends: [],
            other: 0,
            toys: ["pizza", "bone", "ball"]
        },
        {
            $type: "Kitty",
            catName: "Meowy",
            talky: true,
            district: 50,
            birthdate: "2016-03-04",
            friends: [],
            other: "xyz"
        }
    ];
    // Add district property, which exists on DuplicateCat but is not mapped - should not be deserialized
    let duplicateCat2DeserializeJsonObject: object = {
        name: "Duplicate2",
        district: "2016-02-01",
        talky: "2016-03-04",
    };
    let optionalCatJsonObject: IOptionalCat = {
        catName: "OptionalMeowy",
    };
    let animalJsonArray = [cat1JsonObject, dog1JsonObject];
    let catsJsonArray = [cat1JsonObject, cat2JsonObject];

    // JSON objects with only Animal base properties
    let cat1AnimalOnlyJson: IAnimal = {
        name: "Meowy",
        owner: human1JsonObject,
        birthdate: "2016-01-01",
        friends: [],
    };
    let cat2AnimalOnlyJson: IAnimal = {
        name: "Links",
        birthdate: "2016-05-19",
    };
    let dog1AnimalOnlyJson: IAnimal = {
        name: "Barky",
        birthdate: "2017-02-12",
        friends: [],
    };
    let animalsOnlyJsonArray = [cat1AnimalOnlyJson, dog1AnimalOnlyJson];
    let catsAnimalOnlyJsonArray = [cat1AnimalOnlyJson, cat2AnimalOnlyJson];

    // TYPESCRIPT INSTANCES
    let human1 = new Human();
    human1.firstname = "Andreas";
    human1.lastname = "Muster";

    let cat1 = new Cat();
    cat1.name = "Meowy";
    cat1.district = 100;
    cat1.owner = human1;
    cat1.birthdate = new Date("2016-01-01");
    cat1.friends = [];

    let dog1 = new Dog();
    dog1.name = "Barky";
    dog1.isBarking = true;
    dog1.birthdate = new Date("2017-02-12");
    dog1.friends = [];
    dog1.toys = ["pizza", "bone", "ball"];

    let cat2 = new Cat();
    cat2.name = "Links";
    cat2.district = 50;
    cat2.birthdate = new Date("2016-05-19");
    cat2.talky = true;

    let duplicateCat1 = new DuplicateCat();
    duplicateCat1.name = "Duplicate";
    duplicateCat1.district = new Date("2014-10-01");
    duplicateCat1.talky = new Date("2015-02-03");

    let duplicateCat2 = new DuplicateCat();
    duplicateCat2.name = "Duplicate2";
    duplicateCat2.talky = new Date("2016-03-04");

    let optionalCat = new OptionalCat();
    optionalCat.name = "OptionalMeowy";

    let animals = [cat1, dog1];
    let cats = [cat1, cat2];

    let animalHolder = new AnimalHolder();
    animalHolder.name = "Lisa";

    // JSON objects using Typescript mappings
    let cat1Typescript: object = {
        name: "Meowy",
        district: 100,
        owner: {
            firstname: "Andreas",
            lastname: "Muster",
        },
        birthdate: new Date("2016-01-01"),
        friends: [],
        talky: false,
        other: "",
    };
    let cat2Typescript: object = {
        name: "Links",
        district: 50,
        birthdate: new Date("2016-05-19"),
        talky: true,
        other: "",
    };
    let catPartialTypescript: object = {
        name: "Meowy",
    }
    let catPartialInstance = new Cat();
    catPartialInstance.name = "Meowy";
    let dogPartialTypescript: object = {
        name: "Barky",
        isBarking: true,
    }
    let dogPartialInstance = new Dog();
    dogPartialInstance.name = "Barky";
    dogPartialInstance.isBarking = true;
    let dogTypescript: object = {
        name: "Barky",
        isBarking: true,
        birthdate: new Date("2017-02-12"),
        friends: [],
        other: 0,
        toys: ["pizza", "bone", "ball"],
    };
    let animalsTypescript = [cat1Typescript, dogTypescript];
    let catsTypescript = [cat1Typescript, cat2Typescript];

    // SERIALIZE INTEGRATION
    describe("serialize", () => {

        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

        it("should serialize a TypeScript object to a JSON object", () => {
            expect(jsonConvert.serialize(cat1)).toEqual(cat1JsonObject);
            expect(jsonConvert.serialize(cat2)).toEqual(cat2JsonObject);
            expect(jsonConvert.serialize(dog1)).toEqual(dog1JsonObject);
            // District property should not be included in serialized JSON
            expect(jsonConvert.serialize(duplicateCat1)).toEqual(duplicateCat1SerializeJsonObject);
            expect(jsonConvert.serializeObject(cat1)).toEqual(cat1JsonObject);
            expect(jsonConvert.serializeObject(cat2)).toEqual(cat2JsonObject);
            expect(jsonConvert.serializeObject(dog1)).toEqual(dog1JsonObject);
            // District property should not be included in serialized JSON
            expect(jsonConvert.serializeObject(duplicateCat1)).toEqual(duplicateCat1SerializeJsonObject);

            expect(() => jsonConvert.serializeArray(<any>cat1)).toThrow();
        });

        it("should partially serialize a TypeScript object to a JSON object", () => {
            expect(() => jsonConvert.serialize(catPartialTypescript, Cat)).toThrow();
            expect(jsonConvert.partialSerialize(catPartialTypescript, Cat)).toEqual(catPartialJsonObject);
            expect(() => jsonConvert.serialize(dogPartialTypescript, Dog)).toThrow();
            expect(jsonConvert.partialSerialize(dogPartialTypescript, Dog)).toEqual(dogPartialJsonObject);
        });

        it("should serialize a TypeScript array to a JSON array", () => {
            expect(jsonConvert.serialize(animals)).toEqual(animalJsonArray);
            expect(jsonConvert.serialize(cats)).toEqual(catsJsonArray);
            expect(jsonConvert.serializeArray(animals)).toEqual(animalJsonArray);
            expect(jsonConvert.serializeArray(cats)).toEqual(catsJsonArray);

            expect(() => jsonConvert.serializeArray(<any>cat1)).toThrow();
        });

        it("should serialize a plain object using Typescript class mappings", () => {
            expect(jsonConvert.serialize(cat1Typescript, Cat)).toEqual(cat1JsonObject);
            expect(jsonConvert.serialize(dogTypescript, Dog)).toEqual(dog1JsonObject);
            expect(jsonConvert.serializeObject(cat1Typescript, Cat)).toEqual(cat1JsonObject);
            expect(jsonConvert.serializeObject(dogTypescript, Dog)).toEqual(dog1JsonObject);

            expect(() => jsonConvert.serializeObject(catsTypescript, Cat)).toThrow();
        });

        it("should serialize a plain array using Typescript class mappings", () => {
            expect(jsonConvert.serialize(catsTypescript, Animal)).toEqual(catsAnimalOnlyJsonArray);
            expect(jsonConvert.serialize(catsTypescript, Cat)).toEqual(catsJsonArray);
            expect(jsonConvert.serialize(animalsTypescript, Animal)).toEqual(animalsOnlyJsonArray);
            expect(jsonConvert.serializeArray(catsTypescript, Animal)).toEqual(catsAnimalOnlyJsonArray);
            expect(jsonConvert.serializeArray(catsTypescript, Cat)).toEqual(catsJsonArray);
            expect(jsonConvert.serializeArray(animalsTypescript, Animal)).toEqual(animalsOnlyJsonArray);

            expect(() => jsonConvert.serializeArray(<any>cat1Typescript, Cat)).toThrow();
            // Should throw an error if attempting to serialize an array containing a Dog using Cat mappings
            // because required properties are missing
            expect(() => jsonConvert.serializeArray(animalsTypescript, Cat)).toThrow();
        });

        it("should throw an error if serializing a Typescript object with a missing property", () => {
            expect(function () {jsonConvert.serialize(optionalCat);}).toThrowError();
            expect(function () {jsonConvert.serializeObject(optionalCat);}).toThrowError();
        });

        it("should not throw an error if serializing missing property with ignoreRequiredCheck flag set", () => {
            jsonConvert.ignoreRequiredCheck = true;
            expect(jsonConvert.serialize(optionalCat)).toEqual(optionalCatJsonObject);
            expect(jsonConvert.serializeObject(optionalCat)).toEqual(optionalCatJsonObject);
            jsonConvert.ignoreRequiredCheck = false;
        });

        it("should not mutate the expected JSON type mapping for array properties", () => {
            const dog2 = new Dog();
            dog2.toys = ["stick", "ball", "bone"];
            expect((<any>jsonConvert).getClassPropertyMappingOptions(dog2, "toys").expectedJsonType)
                .toEqual([String], "initial expectedJsonType before serializing");
            jsonConvert.serialize(dog2);
            expect((<any>jsonConvert).getClassPropertyMappingOptions(dog2, "toys").expectedJsonType)
                .toEqual([String], "expectedJsonType after serializing");
        });

        it("should not add discriminator property to json if disabled", () => {
            animalHolder.animal = dog1;
            expect(jsonConvert.serialize(animalHolder).animal.$type).toEqual(undefined);
            animalHolder.animal = null;
        });

        it("should add discriminator property to json if enabled and class provided", () => {
            jsonConvert.useDiscriminator = true;
            jsonConvert.unregisterAllClasses();
            jsonConvert.registerClasses(Dog);
            animalHolder.animal = dog1;
            expect(jsonConvert.serialize(animalHolder).animal.$type).toEqual("Doggy");
            animalHolder.animal = null;
            jsonConvert.unregisterAllClasses();
            jsonConvert.useDiscriminator = false;
        });

        it("should not add discriminator property to json if enabled but class not provided", () => {
            jsonConvert.useDiscriminator = true;
            animalHolder.animal = dog1;
            expect(jsonConvert.serialize(animalHolder).animal.$type).toEqual(undefined);
            animalHolder.animal = null;
            jsonConvert.useDiscriminator = false;
        });

    });

    // DESERIALIZE INTEGRATION
    describe("deserialize", () => {

        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

        it("should deserialize a JSON object to a TypeScript object", () => {
            expect(jsonConvert.deserialize(cat1JsonObject, Cat)).toEqual(cat1);
            expect(jsonConvert.deserialize(cat2JsonObject, Cat)).toEqual(cat2);
            expect(jsonConvert.deserialize(dog1JsonObject, Dog)).toEqual(dog1);
            // Duplicate property in JSON should be not be deserialized
            expect(jsonConvert.deserialize(duplicateCat2DeserializeJsonObject, DuplicateCat)).toEqual(duplicateCat2);
            expect(jsonConvert.deserializeObject(cat1JsonObject, Cat)).toEqual(cat1);
            expect(jsonConvert.deserializeObject(cat2JsonObject, Cat)).toEqual(cat2);
            expect(jsonConvert.deserializeObject(dog1JsonObject, Dog)).toEqual(dog1);
            // Duplicate property in JSON should be not be deserialized
            expect(jsonConvert.deserializeObject(duplicateCat2DeserializeJsonObject, DuplicateCat)).toEqual(duplicateCat2);

            expect(() => jsonConvert.deserializeArray(<any>cat1JsonObject, Cat)).toThrow();

        });

        it("should partially deserialize a JSON object to a TypeScript object", () => {
            expect(() => jsonConvert.deserialize(catPartialJsonObject, Cat)).toThrow();
            expect(jsonConvert.partialDeserialize(catPartialJsonObject, Cat)).toEqual(catPartialInstance);
            expect(() => jsonConvert.deserialize(dogPartialJsonObject, Dog)).toThrow();
            expect(jsonConvert.partialDeserialize(dogPartialJsonObject, Dog)).toEqual(dogPartialInstance);
        });

        it("should deserialize a JSON array to a TypeScript array", () => {
            expect(jsonConvert.deserialize(catsJsonArray, Cat)).toEqual(cats);
            expect(jsonConvert.deserializeArray(catsJsonArray, Cat)).toEqual(cats);

            expect(() => jsonConvert.deserializeObject<any>(catsJsonArray, Cat)).toThrow();
        });


        it("should throw an error if deserializing a JSON object with a missing property", () => {
            expect(function () {jsonConvert.deserialize(optionalCatJsonObject, OptionalCat);}).toThrowError();
            expect(function () {jsonConvert.deserializeObject(optionalCatJsonObject, OptionalCat);}).toThrowError();
        });

        it("should not throw an error if deserializing missing property with ignoreRequiredCheck flag set", () => {
            jsonConvert.ignoreRequiredCheck = true;
            expect(jsonConvert.deserialize(optionalCatJsonObject, OptionalCat)).toEqual(optionalCat);
            expect(jsonConvert.deserializeObject(optionalCatJsonObject, OptionalCat)).toEqual(optionalCat);
            jsonConvert.ignoreRequiredCheck = false;
        });

        it("should not mutate the expected JSON type mapping for array properties", () => {
            const dog2 = new Dog();
            expect((<any>jsonConvert).getClassPropertyMappingOptions(dog2, "toys").expectedJsonType)
                .toEqual([String], "initial expectedJsonType before deserializing");
            jsonConvert.deserialize(dog1JsonObject, Dog);
            expect((<any>jsonConvert).getClassPropertyMappingOptions(dog2, "toys").expectedJsonType)
                .toEqual([String], "expectedJsonType after deserializing");
        });

        it("should use lazy-loading feature if classes registered", () => {
            jsonConvert.registerClasses(Human);
            expect(jsonConvert.deserializeObject(cat1AnimalOnlyJson, AnimalWithLazyHuman).getOwnerName()).toEqual("Andreas");
            jsonConvert.unregisterAllClasses();
        });

        it("should throw an error if lazy-loading class not registered", () => {
            expect(() => jsonConvert.deserializeObject(cat1AnimalOnlyJson, AnimalWithLazyHuman).getOwnerName()).toThrow();
        });

        it("should get class from discriminator property if enabled", () => {
            jsonConvert.useDiscriminator = true;
            jsonConvert.unregisterAllClasses();
            jsonConvert.registerClasses(AnimalHolder, Dog);
            const result = jsonConvert.deserialize<AnimalHolder>(animalHolderWithDogJsonObject);
            expect(result).toBeInstanceOf(AnimalHolder);
            expect(result.animal).toBeInstanceOf(Dog);
            jsonConvert.unregisterAllClasses();
            jsonConvert.useDiscriminator = false;
        });

        it("should get classes from discriminator property if enabled", () => {
            jsonConvert.useDiscriminator = true;
            jsonConvert.unregisterAllClasses();
            jsonConvert.registerClasses(Dog, Cat);
            const result = jsonConvert.deserialize<Animal>(differentAnimalsJsonArray);
            expect(result[0]).toBeInstanceOf(Dog);
            expect(result[1]).toBeInstanceOf(Cat);
            jsonConvert.unregisterAllClasses();
            jsonConvert.useDiscriminator = false;
        });

        it("should not get class from discriminator property if disabled", () => {
            jsonConvert.useDiscriminator = false;
            const result = jsonConvert.deserialize(animalHolderWithDogJsonObject, AnimalHolder);
            expect(result.animal).toBeInstanceOf(Animal);
            const isDog = result.animal instanceof Dog;
            expect(isDog).toBeFalse();
        });

        it("should not get class from discriminator property if enabled but no classes provided", () => {
            jsonConvert.useDiscriminator = true;
            expect(() => jsonConvert.deserialize(animalHolderWithDogJsonObject, AnimalHolder)).toThrow();
            jsonConvert.useDiscriminator = false;
        });

    });

});
