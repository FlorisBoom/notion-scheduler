import path from "path";
import * as dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export = notion;
