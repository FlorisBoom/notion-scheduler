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

  await updatePages(pagesDto);
}

async function updatePages(pagesDto: NotionPageDto[]): Promise<void> {
  await Promise.each(pagesDto, async (page: NotionPageDto) => {
    if (
      (!page.releaseSchedule || page.releaseSchedule === getCurrentDay())
      && (page.status !== EPageStatus.COMPLETED && page.status !== EPageStatus.DROPPED)) {
      await axios.get(page.link)
        .then(async (response) => {
          if (response.status === 200) {
            Logger.log({
              level: "info",
              message: `Syncing data for ${page.title}`,
            });

            const document = cheerio.load(response.data);
            const url = new URL(page.link);

            switch (url.hostname) {
              case "pahe.win":
                await updatedLatestReleasePahe(document, page.id, page.latestRelease);
                break;
              case "toomics.com":
                await updatedLatestReleaseToomics(document, page.id, page.latestRelease);
                break;
              case "mangahub.io":
                await updatedLatestReleaseMangahub(document, page.id, page.latestRelease);
                break;
              case "mangakakalot.com":
                await updatedLatestReleaseMangakakalot(document, page.id, page.latestRelease);
                break;
              case "readmanganato":
                await updatedLatestReleaseManganato(document, page.id, page.latestRelease);
                break;
              default:
                break;
            }
          }
        }).catch((err) => {
          Logger.log({
            level: "error",
            message: err,
          });
        });
    }
  });
}

async function updatedLatestReleasePahe(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document("title").text().split("-")[1].match(/\d+/g)[0];

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease, new Date());
  }
}

async function updatedLatestReleaseToomics(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".normal_ep")
    .last()
    .children("a")
    .children(".cell-num")
    .children("span")
    .text();

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease, new Date());
  }
}

async function updatedLatestReleaseMangahub(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".list-group-item")
    .first()
    .children("a")
    .children("span")
    .children("span")
    .first()
    .text()
    .replace(/^\D+/g, "");

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease, new Date());
  }
}

async function updatedLatestReleaseMangakakalot(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".chapter-list")
    .children(".row")
    .first()
    .children("span")
    .first()
    .children("a")
    .text()
    .replace(/^\D+/g, "");

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease, new Date());
  }
}

async function updatedLatestReleaseManganato(document: any, pageId: string, currentRelease: number): Promise<void> {
  const latestRelease = document(".row-content-chapter")
    .children("li")
    .first()
    .children("a")
    .text()
    .replace(/^\D+/g, "");

  if (currentRelease !== +latestRelease) {
    await updateNotionPage(pageId, +latestRelease, new Date());
  }
}

function getCurrentDay(): string {
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

export = { run };
