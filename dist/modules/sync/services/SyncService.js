"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const axios_1 = __importDefault(require("axios"));
const bluebird_1 = require("bluebird");
const cheerio = __importStar(require("cheerio"));
const Logger_1 = __importDefault(require("../../../shared/utils/Logger"));
const definitions_1 = require("../../database/definitions");
const Database_1 = require("../../database/repositories/Database");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        Logger_1.default.log({
            level: "info",
            message: "Running Notion database sync",
        });
        const pagesDto = yield Database_1.getNotionPages();
        yield updatePages(pagesDto);
    });
}
function updatePages(pagesDto) {
    return __awaiter(this, void 0, void 0, function* () {
        yield bluebird_1.Promise.each(pagesDto, (page) => __awaiter(this, void 0, void 0, function* () {
            if ((!page.releaseSchedule || page.releaseSchedule === getCurrentDay())
                && (page.status !== definitions_1.EPageStatus.COMPLETED && page.status !== definitions_1.EPageStatus.DROPPED)) {
                yield axios_1.default.get(page.link)
                    .then((response) => __awaiter(this, void 0, void 0, function* () {
                    if (response.status === 200) {
                        Logger_1.default.log({
                            level: "info",
                            message: `Syncing data for ${page.title}`,
                        });
                        const document = cheerio.load(response.data);
                        const url = new URL(page.link);
                        switch (url.hostname) {
                            case "pahe.win":
                                yield updateLatestReleasePahe(document, page.id, page.latestRelease);
                                break;
                            case "toomics.com":
                                yield updateLatestReleaseToomics(document, page.id, page.latestRelease);
                                break;
                            case "mangahub.io":
                                yield updateLatestReleaseMangahub(document, page.id, page.latestRelease);
                                break;
                            case "mangakakalot.com":
                                yield updateLatestReleaseMangakakalot(document, page.id, page.latestRelease);
                                break;
                            case "readmanganato":
                                yield updateLatestReleaseManganato(document, page.id, page.latestRelease);
                                break;
                            default:
                                break;
                        }
                    }
                })).catch((err) => {
                    Logger_1.default.log({
                        level: "error",
                        message: err,
                    });
                });
            }
        }));
    });
}
function updateLatestReleasePahe(document, pageId, currentRelease) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestRelease = (document("title").text().split("-").length > 1)
            ? document("title").text().split("-")[1].match(/\d+/g)[0]
            : document("title").text().split("-")[0].match(/\d+/g)[0];
        if (currentRelease !== +latestRelease) {
            yield Database_1.updateNotionPage(pageId, +latestRelease);
        }
    });
}
function updateLatestReleaseToomics(document, pageId, currentRelease) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestRelease = document(".normal_ep")
            .last()
            .children("a")
            .children(".cell-num")
            .children("span")
            .text();
        if (currentRelease !== +latestRelease) {
            yield Database_1.updateNotionPage(pageId, +latestRelease);
        }
    });
}
function updateLatestReleaseMangahub(document, pageId, currentRelease) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestRelease = document(".list-group-item")
            .first()
            .children("a")
            .children("span")
            .children("span")
            .first()
            .text()
            .replace(/^\D+/g, "");
        if (currentRelease !== +latestRelease) {
            yield Database_1.updateNotionPage(pageId, +latestRelease);
        }
    });
}
function updateLatestReleaseMangakakalot(document, pageId, currentRelease) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestRelease = document(".chapter-list")
            .children(".row")
            .first()
            .children("span")
            .first()
            .children("a")
            .text()
            .replace(/^\D+/g, "");
        if (currentRelease !== +latestRelease) {
            yield Database_1.updateNotionPage(pageId, +latestRelease);
        }
    });
}
function updateLatestReleaseManganato(document, pageId, currentRelease) {
    return __awaiter(this, void 0, void 0, function* () {
        const latestRelease = document(".row-content-chapter")
            .children("li")
            .first()
            .children("a")
            .text()
            .replace(/^\D+/g, "");
        if (currentRelease !== +latestRelease) {
            yield Database_1.updateNotionPage(pageId, +latestRelease);
        }
    });
}
function getCurrentDay() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const weekdays = new Array(7);
    weekdays[0] = "Monday";
    weekdays[1] = "Tuesday";
    weekdays[2] = "Wednesday";
    weekdays[3] = "Thursday";
    weekdays[4] = "Friday";
    weekdays[5] = "Saturday";
    weekdays[6] = "Sunday";
    return weekdays[currentDay];
}
module.exports = { run };
//# sourceMappingURL=SyncService.js.map