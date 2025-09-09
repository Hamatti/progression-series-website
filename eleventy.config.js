export default async function (eleventyConfig) {
  eleventyConfig.addDataExtension("score", (contents, filePath) => {
    const matchData = contents.split("\n");

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
  });

  eleventyConfig.addPassthroughCopy("assets");
}
