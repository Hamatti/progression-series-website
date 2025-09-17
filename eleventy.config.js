import filters from "./_11ty/filters.js";
import {
  convertScoresToSeriesObjects,
  createSeriesScoresCollection,
  createFullRankingTable,
} from "./_11ty/utils.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addDataExtension("score", (contents, _) => {
    const matchesData = contents.split("\n");
    return convertScoresToSeriesObjects(matchesData);
  });

  eleventyConfig.addCollection("seriesScores", (collection) => {
    return createSeriesScoresCollection(collection);
  });

  eleventyConfig.addCollection("ranking", (collection) => {
    return createFullRankingTable(collection);
  });

  Object.entries(filters).forEach(([name, callback]) => {
    eleventyConfig.addFilter(name, callback);
  });
}
