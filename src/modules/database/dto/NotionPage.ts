import { NotionPageDto } from "@database/definitions";

export = (page: any): NotionPageDto => {
  const properties = page.properties;

  return {
    id: page.id,
    type: properties.Type.select.name,
    title: properties.Title.title[0].plain_text,
    link: properties.Link.url,
    status: properties.Status.multi_select.map((select) => select.name),
    currentProgress: (properties["Current Progress"]) ? properties["Current Progress"].number : 0,
    latestRelease: properties["Latest Release"].number,
    seenLatestRelease: properties["Seen Latest Release"].checkbox,
    releaseSchedule: (properties["Release Schedule"].multi_select.length >= 1)
      ? properties["Release Schedule"].multi_select[0].name
      : null,
    latestReleaseUpdatedAt: (properties["Latest Release Updated At"])
      ? properties["Latest Release Updated At"].date.start
      : null,
    rating: (properties.Rating)
      ? properties.Rating.number
      : null,
  };
};
