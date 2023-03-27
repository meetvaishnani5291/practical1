const fs = require("fs");

const getTime = (timeString) => {
  const date = new Date("01/01/2000 " + timeString);

  return date.getTime();
};
const getTimezoneOffset = function (timezoneAbbr) {
  const timezones = JSON.parse(
    fs.readFileSync("assets/timezone.json", { encoding: "utf-8" })
  );
  const timezone = timezones.find((timezone) => timezone.abbr === timezoneAbbr);
  if (timezone !== undefined) {
    return timezone.offset;
  } else {
    throw new Error("Timezone not found!");
  }
};

module.exports = convertTimezone = (
  currentTime,
  currentTimezone,
  convertToTimezone
) => {
  try {
    const currentTimezoneOffset = getTimezoneOffset(currentTimezone);
    const convertToTimezoneOffset = getTimezoneOffset(convertToTimezone);

    const utcTime =
      getTime(currentTime) - currentTimezoneOffset * 60 * 60 * 1000;
    const convertedTime = utcTime + convertToTimezoneOffset * 60 * 60 * 1000;

    return new Date(convertedTime).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } catch (error) {
    throw error;
  }
};
