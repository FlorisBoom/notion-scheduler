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
exports.getNotionDatabase = void 0;
const Notion_1 = __importDefault(require("../../../shared/config/Notion"));
const NotionPage_1 = __importDefault(require("../dto/NotionPage"));
// type NotionParent = {
// }
// type NotionProperties = {
// }
// type NotionPage = {
//   object: string;
//   id: string;
//   createdTime: Date;
//   lastEditedTime: Date;
//   parent: {
//     type: string;
//     databaseId: string;
//   };
//   archived: boolean;
//   properties: {
//     type: {
//       id: string;
//       type: string;
//       select: unknown;
//     };
//     link: {
//       id: string;
//       type: string;
//       url: string;
//     };
//     status: {
//       id: string;
//       type: string;
//       select: unknown;
//     }
//     "latestRelease": {
//       id: string;
//       type: string;
//       number: number;
//     };
//     "seenLatestRelease": {
//       id: string;
//       type: string;
//       checkbox: boolean;
//     }
//     "releaseSchedule": {
//       id: string;
//       type: string;
//       multiSelect: Array<string>;
//     };
//     title: {
//       id: string;
//       type: string;
//       title: Array<string>;
//     }
//   };
// }
function getNotionDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const allPages = yield Notion_1.default.databases.query({
            database_id: "ddc42ff509614095b9632a28e19f7429",
        }).then((pages) => pages.results.map(NotionPage_1.default));
        // const properties = R.pluck("properties", allPages);
        // console.log(properties[0])
        // console.log(properties[0].Title)
        // return R.map(notionPropertiesDto(properties));
        console.log("allPages = ", allPages);
    });
}
exports.getNotionDatabase = getNotionDatabase;
//# sourceMappingURL=Database.js.map