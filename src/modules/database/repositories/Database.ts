import { Promise } from "bluebird";
import { DateTime } from "luxon";
import Notion from "@shared/config/Notion";
import { NotionPageDto } from "@database/definitions";
import createNotionPageDto from "@database/dto/NotionPage";

const databaseId = "ddc42ff509614095b9632a28e19f7429";

async function getNotionPages(): Promise<NotionPageDto[]> {
  const results = await Notion.databases.query({
    database_id: databaseId,
  });
  let nextCursor = results.next_cursor;

  do {
    /* eslint-disable no-await-in-loop */
    await Notion.databases.query({
      database_id: databaseId,
      start_cursor: nextCursor,
    // eslint-disable-next-line no-loop-func
    }).then((results2) => {
      nextCursor = results2.next_cursor;

      results.results = results.results.concat(results2.results);
    });
  } while (nextCursor);

  return results.results.map((page) => createNotionPageDto(page));
}

async function updateNotionPage(pageId: string, latestRelease: number): Promise<void> {
  await Notion.pages.update({
    page_id: pageId,
    properties: {
      "Latest Release Updated At": {
        type: "date",
        date: {
          start: DateTime.now().setZone("Europe/Amsterdam").toISO(),
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
}

export { getNotionPages, updateNotionPage };
