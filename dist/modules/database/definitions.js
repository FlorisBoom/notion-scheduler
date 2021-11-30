"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPageType = exports.EPageStatus = void 0;
// eslint-disable-next-line no-shadow
var EPageStatus;
(function (EPageStatus) {
    EPageStatus["COMPLETED"] = "Completed";
    EPageStatus["DROPPED"] = "Dropped";
    EPageStatus["PLANNING_TO_READ"] = "Planning To Read";
    EPageStatus["PLANNING_TO_WATCH"] = "Planning To Watch";
    EPageStatus["READING"] = "Reading";
    EPageStatus["WATCHING"] = "Watching";
    EPageStatus["ON_HOLD"] = "On Hold";
    EPageStatus["DONE_AIRING"] = "Done Airing";
})(EPageStatus = exports.EPageStatus || (exports.EPageStatus = {}));
// eslint-disable-next-line no-shadow
var EPageType;
(function (EPageType) {
    EPageType["MANGA"] = "Manga";
    EPageType["ANIME"] = "Anime";
})(EPageType = exports.EPageType || (exports.EPageType = {}));
//# sourceMappingURL=definitions.js.map