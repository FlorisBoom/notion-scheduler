"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotionPage = exports.getNotionPages = void 0;
const luxon_1 = require("luxon");
const Notion_1 = __importDefault(require("../../../shared/config/Notion"));
const NotionPage_1 = __importDefault(require("../dto/NotionPage"));
const databaseId = "ddc42ff509614095b9632a28e19f7429";
function getNotionPages() {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield Notion_1.default.databases.query({
            database_id: databaseId,
        });
        let nextCursor = results.next_cursor;
        do {
            /* eslint-disable no-await-in-loop */
            yield Notion_1.default.databases.query({
                database_id: databaseId,
                start_cursor: nextCursor,
                // eslint-disable-next-line no-loop-func
            }).then((results2) => {
                nextCursor = results2.next_cursor;
                results.results = results.results.concat(results2.results);
            });
        } while (nextCursor);
        // if (result.has_more) {
        //   await Promise.each(Array(10), async () => {
        //     if (nextCursor) {
        //       await Notion.databases.query({
        //         database_id: databaseId,
        //         start_cursor: nextCursor,
        //       }).then((result2) => {
        //         nextCursor = result2.next_cursor;
        //         result.results = result.results.concat(result2.results);
        //       });
        //     }
        //   });
        // }
        return results.results.map((page) => NotionPage_1.default(page));
    });
}
exports.getNotionPages = getNotionPages;
function updateNotionPage(pageId, latestRelease) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Notion_1.default.pages.update({
            page_id: pageId,
            properties: {
                "Latest Release Updated At": {
                    type: "date",
                    date: {
                        start: luxon_1.DateTime.now().setZone("Europe/Amsterdam").toISO(),
                    },
                },
                "Latest Release": {
                    type: "number",
                    number: latestRelease,
                },
                "Seen Latest Release": {
                    type: "checkbox",
                    checkbox: false,
                },
            },
        });
    });
}
exports.updateNotionPage = updateNotionPage;
//# sourceMappingURL=Database.js.map