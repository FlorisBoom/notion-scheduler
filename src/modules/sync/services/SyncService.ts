import Logger from "@shared/utils/Logger";
import { getNotionDatabase } from "@database/repositories/Database";

async function run(): Promise<void> {
  Logger.log({
    level: "info",
    message: "Running Notion database sync",
  });

  const notionDatabase = await getNotionDatabase();
}

export = { run };
