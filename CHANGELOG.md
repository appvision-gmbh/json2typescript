# v0.9.7 (2017-07-15)

## Bug Fixes

* Fixed issue with `ValueCheckingMode` by using an enum instead of a nested class, closes [#10](https://github.com/dhlab-basel/json2typescript/issues/10) and [#11](https://github.com/dhlab-basel/json2typescript/issues/11) 
* Added missing js references, closes [#11](https://github.com/dhlab-basel/json2typescript/issues/11) and [#16](https://github.com/dhlab-basel/json2typescript/issues/16)

## Features

* Allow serialization the same way as deserialization, closes [#4](https://github.com/dhlab-basel/json2typescript/issues/4)
* Added custom converters, closes [#6](https://github.com/dhlab-basel/json2typescript/issues/6)
* Use class methods instead of static methods, closes [#14](https://github.com/dhlab-basel/json2typescript/issues/14)

## Breaking Changes

* Use an instance of `JsonConvert` its class methods instead of the static methods.

* The property `valueCheckingMode` of the `JsonConvert` class needs to be set using the exported enum `ValueCheckingMode` instead of the inner class `JsonConvert.ValueCheckingMode`. If you would like to set the `valueCheckingMode`, please make the additional import of `ValueCheckingMode` and use this.

# 0.9.6  (2017-01-18) 
Fixed errors in ReadMe and small bug on JsonConvert.

# 0.9.5  (2017-12-11): 
New method for deserializing array of objects.

# 0.9.4  (2017-11-22): 
Class properties are now not overridden to `undefined` if there is no decorator and no matching json value.

# 0.9.3  (2017-11-16): 
It is now possible to map an JSON object to an TypeScript array, then the object keys become the array keys. Also, class properties can be set to optional. See below in the chapter "decorators" for more information.

# 0.9.2  (2017-10-10): 
Added method `serializeString()`, changed property names and behaviour.

# 0.9.1 (2017-10-06): 
First version released to the public.