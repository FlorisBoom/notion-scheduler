"use strict";
module.exports = (page) => {
    const properties = page.properties;
    return {
        id: page.id,
        type: properties.Type.select.name,
        title: properties.Title.title[0].plain_text,
        link: properties.Link.url,
        status: properties.Status.select.name,
        currentProgress: properties["Current Progress"].number,
        latestRelease: properties["Latest Release"].number,
        seenLatestRelease: properties["Seen Latest Release"].checkbox,
        releaseSchedule: (properties["Release Schedule"].multi_select.length >= 1)
            ? properties["Release Schedule"].multi_select[0].name
            : null,
        latestReleaseUpdatedAt: (properties["Latest Release Updated At"])
            ? properties["Latest Release Updated At"].date.start
            : null,
    };
};
//# sourceMappingURL=NotionPage.js.map