"use strict";
(function (OperationMode) {
    OperationMode[OperationMode["DISABLE"] = 0] = "DISABLE";
    OperationMode[OperationMode["ENABLE"] = 1] = "ENABLE";
    OperationMode[OperationMode["LOGGING"] = 2] = "LOGGING";
})(exports.OperationMode || (exports.OperationMode = {}));
var OperationMode = exports.OperationMode;
;
(function (ValueCheckingMode) {
    ValueCheckingMode[ValueCheckingMode["ALLOW_NULL"] = 1] = "ALLOW_NULL";
    ValueCheckingMode[ValueCheckingMode["ALLOW_OBJECT_NULL"] = 2] = "ALLOW_OBJECT_NULL";
    ValueCheckingMode[ValueCheckingMode["DISALLOW_NULL"] = 3] = "DISALLOW_NULL";
})(exports.ValueCheckingMode || (exports.ValueCheckingMode = {}));
var ValueCheckingMode = exports.ValueCheckingMode;
;
//# sourceMappingURL=/Users/andreas/Documents/Git/git.appvision.ch/unibasel/json2typescript/src/json2typescript/json-convert-enums.js.map