import { CronJob } from "cron";
import express from "express";
import Logger from "@shared/utils/Logger";
import SyncService from "@sync/services/SyncService";

const app = express();

app.listen(3000);

const syncJob = new CronJob({
  cronTime: "* 0/2 * * *", // Every second hour
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
