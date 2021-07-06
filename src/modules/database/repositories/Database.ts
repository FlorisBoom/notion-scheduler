import { Promise } from "bluebird";
import { DateTime } from "luxon";
import Notion from "@shared/config/Notion";
import { NotionPageDto } from "@database/definitions";
import createNotionPageDto from "@database/dto/NotionPage";

const databaseId = "ddc42ff509614095b9632a28e19f7429";

async function getNotionPages(): Promise<NotionPageDto[]> {
  const result = await Notion.databases.query({
    database_id: databaseId,
  });
  let nextCursor = result.next_cursor;

  if (result.has_more) {
    await Promise.each(Array(10), async () => {
      if (nextCursor) {
        await Notion.databases.query({
          database_id: databaseId,
          start_cursor: nextCursor,
        }).then((result2) => {
          nextCursor = result2.next_cursor;

          result.results = result.results.concat(result2.results);
        });
      }
    });
  }

  return result.results.map((page) => createNotionPageDto(page));
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
