"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortAttribute = exports.CsvHeaders = exports.AwardAction = void 0;
var AwardAction;
(function (AwardAction) {
    AwardAction["VEST"] = "VEST";
    AwardAction["CANCEL"] = "CANCEL";
})(AwardAction = exports.AwardAction || (exports.AwardAction = {}));
var CsvHeaders;
(function (CsvHeaders) {
    CsvHeaders["ACTION"] = "0";
    CsvHeaders["EMPLOYEE_ID"] = "1";
    CsvHeaders["EMPLOYEE_NAME"] = "2";
    CsvHeaders["AWARD_ID"] = "3";
    CsvHeaders["DATE"] = "4";
    CsvHeaders["QUANTITY"] = "5";
})(CsvHeaders = exports.CsvHeaders || (exports.CsvHeaders = {}));
var SortAttribute;
(function (SortAttribute) {
    SortAttribute[SortAttribute["EMPLOYEE_ID"] = 0] = "EMPLOYEE_ID";
    SortAttribute[SortAttribute["AWARD_ID"] = 2] = "AWARD_ID";
})(SortAttribute = exports.SortAttribute || (exports.SortAttribute = {}));
