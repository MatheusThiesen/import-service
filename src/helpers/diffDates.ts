async function diffDates(date1: Date, date2: Date) {
  var diffMs = date2.getTime() - date1.getTime();
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
  var diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000);
  var diff = diffHrs + "h " + diffMins + "m " + diffSecs + "s";

  return diff;
}

export { diffDates };
