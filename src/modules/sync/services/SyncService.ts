import axios from "axios";
import { Promise } from "bluebird";
import * as cheerio from "cheerio";
import Logger from "@shared/utils/Logger";
import { NotionPageDto, EPageStatus } from "@database/definitions";
import { getNotionPages, updateNotionPage } from "@database/repositories/Database";

async function run(): Promise<void> {
  Logger.log({
    level: "info",
    message: "Running Notion database sync",
  });

  const pagesDto = await getNotionPages();

  console.log(getCurrentDay());

  // await updatePages(pagesDto);
}

async function updatePages(pagesDto: NotionPageDto[]): Promise<void> {
  await Promise.each(pagesDto, async (page: NotionPageDto) => {
    if (
      (!page.releaseSchedule || page.releaseSchedule === getCurrentDay())
      && !(
        page.status.includes(EPageStatus.COMPLETED)
        || page.status.includes(EPageStatus.DROPPED)
        || page.status.includes(EPageStatus.DONE_AIRING))
    ) {
      await axios.get(page.link)
        .then(async (response) => {
          if (response.status === 200) {
            const url = new URL(page.link);

            Logger.log({
              level: "info",
              message: `Syncing data for ${page.title} from ${url.hostname}`,
            });

            const document = cheerio.load(response.data);

            switch (url.hostname) {
              case "pahe.win":
                await updateLatestReleasePahe(document, page.id, page.latestRelease);
                break;
              case "toomics.com":
                await updateLatestReleaseToomics(document, page.id, page.latestRelease);
                break;
              case "mangahub.io":
                await updateLatestReleaseMangahub(document, page.id, page.latestRelease);
                break;
              case "mangakakalot.com":
                await updateLatestReleaseMangakakalot(document, page.id, page.latestRelease);
                break;
              case "readmanganato.com":
                await updateLatestReleaseManganato(document, page.id, page.latestRelease);
                break;
              default:
                break;
            }
          }
        }).catch((err) => {
          Logger.log({
            level: "error",
            message: `Failed to sync ${page.title} Error: ${err}`,
          });
        });
    }
  });
}

async function updateLatestReleasePahe(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = (document("title").text().split("-").length > 1)
    ? document("title").text().split("-")[1].match(/\d+/g)[0]
    : document("title").text().split("-")[0].match(/\d+/g)[0];

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease);
  }
}

async function updateLatestReleaseToomics(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".normal_ep")
    .last()
    .children("a")
    .children(".cell-num")
    .children("span")
    .text();

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease);
  }
}

async function updateLatestReleaseMangahub(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".list-group-item")
    .first()
    .children("a")
    .children("span")
    .children("span")
    .first()
    .text()
    .replace(/^\D+/g, "");

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease);
  }
}

async function updateLatestReleaseMangakakalot(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".chapter-list")
    .children(".row")
    .first()
    .children("span")
    .first()
    .children("a")
    .text()
    .match(/\d+/g)[0];

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease);
  }
}

async function updateLatestReleaseManganato(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".row-content-chapter")
    .children("li")
    .first()
    .children("a")
    .text()
    .match(/\d+/g)[0];

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease);
  }
}

function getCurrentDay(): string {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const weekdays = new Array(8);

  weekdays[1] = "Monday";
  weekdays[2] = "Tuesday";
  weekdays[3] = "Wednesday";
  weekdays[4] = "Thursday";
  weekdays[5] = "Friday";
  weekdays[6] = "Saturday";
  weekdays[7] = "Sunday";

  return weekdays[currentDay];
}

export = { run };
