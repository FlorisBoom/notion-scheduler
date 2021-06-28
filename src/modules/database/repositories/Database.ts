import Notion from "@shared/config/Notion";
import { NotionPageDto } from "@database/definitions";
import notionPropertiesDto from "@database/dto/NotionPage";

async function getNotionDatabase(): Promise<NotionPageDto[]> {
  return Notion.databases.query({
    database_id: "ddc42ff509614095b9632a28e19f7429",
  }).then((pages) => pages.results.map(notionPropertiesDto));
}

export { getNotionDatabase };
