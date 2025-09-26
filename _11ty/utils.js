/**
 * Creates a new collection where each series data
 * is accessible with their id. This data already exists
 * as global data but global data is not dynamically accessible.
 *
 * @param {*} eleventyCollection
 * @returns
 */
export function createSeriesScoresCollection(eleventyCollection) {
  const data = eleventyCollection.getAll()[0].data;

  const series = {};
  data.series.forEach((serie) => {
    series[serie.id] = data[serie.id];
  });

  return series;
}

/**
 * Converts a list of colon separated score entries such as
 * `playerA:playerB:2:1`
 * into an array of objects with player name and their stats.
 *
 * @param {Array<String>} matchesData
 * @returns A ranking table and matchups for a series
 */
export function convertScoresToSeriesObjects(matchesData) {
  const ranking = {};
  const matches = [];

  matchesData.forEach((match) => {
    let [home, away, homeScore, awayScore] = match.split(":");
    matches.push([home, away, homeScore, awayScore]);

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

  const rankingTable = Object.entries(ranking)
    .map(([playerName, stats]) => {
      return {
        playerName,
        stats,
      };
    })
    .sort((a, b) => b.stats.wins - a.stats.wins);

  return { table: rankingTable, matches };
}

/**
 * Combines ranking tables for each series
 * into one combined one.
 *
 * @param {*} eleventyCollection
 * @returns Ranking table of all matches across series
 */
export function createFullRankingTable(eleventyCollection) {
  const items = eleventyCollection.getAll()[0];
  const series = items.data.series;

  const allRankingTables = series.map((serie) => {
    return items.data[serie.id].table;
  });

  const playerStats = {};

  allRankingTables.forEach((table) => {
    table?.forEach((player) => {
      const entry = playerStats[player.playerName] || {
        playerName: player.playerName,
        stats: { games: 0, wins: 0, losses: 0 },
      };

      entry.stats.games += player.stats.games;
      entry.stats.wins += player.stats.wins;
      entry.stats.losses += player.stats.losses;

      playerStats[player.playerName] = entry;
    });
  });

  const fullRankingTable = Object.values(playerStats).sort(
    (a, b) => b.stats.wins - a.stats.wins
  );

  return fullRankingTable;
}
