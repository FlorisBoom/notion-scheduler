import path from "path";
import { CronJob } from "cron";
import express from "express";
import Logger from "@shared/utils/Logger";
import SyncService from "@sync/services/SyncService";

const app = express();

app.listen(3000);

const syncJob = new CronJob({
  cronTime: "*/1 * * * *", // Every 10 minutes
  async onTick() {
    try {
      await SyncService.run();
    } catch (err) {
      Logger.log({
        level: "error",
        message: `${err}, Failure inside sync job.`,
      });
    }
  },
  timeZone: "Europe/Amsterdam",
});

syncJob.start();
