function ongoing(isOngoing) {
  return isOngoing ? "ongoing" : "finished";
}
function finishedSeries(series) {
  return series.filter((serie) => !serie.ongoing).length || 0;
}

export default { ongoing, finishedSeries };
