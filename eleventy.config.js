function createRanking(matchData) {
  const ranking = {};
  const matches = [];

  matchData.forEach((match) => {
    let [home, away, homeScore, awayScore] = match.split(":");
    matches.push(`${home} - ${away} ${homeScore}-${awayScore}`);

    if (!ranking[home]) {
      ranking[home] = { games: 0, wins: 0, losses: 0 };
    }
    if (!ranking[away]) {
      ranking[away] = { games: 0, wins: 0, losses: 0 };
    }

    let isHomeWin = parseInt(homeScore) > parseInt(awayScore);

    ranking[home].games += 1;
    ranking[home].wins += isHomeWin ? 1 : 0;
    ranking[home].losses += isHomeWin ? 0 : 1;

    ranking[away].games += 1;
    ranking[away].wins += isHomeWin ? 0 : 1;
    ranking[away].losses += isHomeWin ? 1 : 0;
  });

  const rankingTable = Object.entries(ranking).map(([playerName, stats]) => {
    return {
      playerName,
      stats,
    };
  });

  rankingTable.sort((a, b) => b.stats.wins - a.stats.wins);

  return { table: rankingTable, matches };
}

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addDataExtension("score", (contents, filePath) => {
    const matchData = contents.split("\n");
    return createRanking(matchData);
  });

  eleventyConfig.addCollection("series", (collection) => {
    const all = collection.getAll();
    const data = all.find((t) => t.inputPath === "./index.njk").data;

    const series = {};
    data.series.forEach((serie) => {
      return (series[serie.id] = data[serie.id]);
    });

    return series;
  });

  eleventyConfig.addCollection("ranking", (collection) => {
    const items = collection.getAll()[0];
    const series = items.data.series;

    const allRankings = series.map((serie) => {
      return items.data[serie.id].table;
    });

    let combined = allRankings.reduce((accumulativeRanking, currentSeries) => {
      return currentSeries.map((player) => {
        const entry = accumulativeRanking.find(
          (e) => e.playerName == player.playerName
        ) || {
          playerName: player.playerName,
          stats: { games: 0, wins: 0, losses: 0 },
        };

        entry.stats.games += player.stats.games;
        entry.stats.wins += player.stats.wins;
        entry.stats.losses += player.stats.losses;

        return entry;
      });
    }, []);

    return combined;
  });

  eleventyConfig.addFilter("ongoing", (isOngoing) => {
    return isOngoing ? "ongoing" : "";
  });

  eleventyConfig.addFilter("finishedSeries", (series) => {
    return series.filter((serie) => !serie.ongoing).lenght || 0;
  });
}
