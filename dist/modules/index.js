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
const cron_1 = require("cron");
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("../shared/utils/Logger"));
const SyncService_1 = __importDefault(require("./sync/services/SyncService"));
const app = express_1.default();
app.listen(3000);
const syncJob = new cron_1.CronJob({
    cronTime: "*/1 * * * *",
    onTick() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SyncService_1.default.run();
            }
            catch (err) {
                Logger_1.default.log({
                    level: "error",
                    message: `${err}, Failure inside sync job.`,
                });
            }
        });
    },
    timeZone: "Europe/Amsterdam",
});
syncJob.start();
//# sourceMappingURL=index.js.map