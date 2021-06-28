"use strict";
module.exports = (page) => {
    const properties = page.properties;
    console.log("properties = ", properties);
    return {
        type: properties.Type.select.name,
        title: properties.Title.title[0].plain_text,
        link: properties.Link.url,
        status: properties.Status.select.name,
        currentProgress: properties["Current Progress"].number,
        latestRelease: properties["Latest Release"].number,
        seenLatestRelease: properties["Seen Latest Release"].checkbox,
        releaseSchedule: properties["Release Schedule"].multi_select,
    };
};
//# sourceMappingURL=NotionPage.js.map