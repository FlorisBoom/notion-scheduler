import { CronJob } from 'cron';

const syncJob = new CronJob({
  cronTime: "10 * * * *", // Every 10 minutes
  async onTick() {

  },
  timeZone: "Europe/Amsterdam",
});

const scrapperJob = new CronJob({
  cronTime: "* * * *", 
  async onTick() {

  },
  timeZone: "Europe/Amsterdam",
});
