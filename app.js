const inquirer = require("inquirer");
const fs = require("fs");

const convertTimezone = require("./getTime");

const questions = [
  {
    type: "input",
    name: "CURRENT_TIME",
    message: "time ex: 12:30 PM",
    default() {
      let dateString = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      dateString = dateString.slice(0, -3) + " " + dateString.slice(-2);

      return dateString;
    },
    validate(time) {
      const regex = /^(1[012]|[1-9]|0[1-9]):[0-5][0-9](\s)(AM|PM)$/i;
      if (regex.test(time)) return true;
      return "please enter in correct format";
    },
  },
  {
    type: "input",
    name: "CURRENT_TIMEZONE",
    message: "CURRENT_TIMEZONE",
    default() {
      const getAbbr = (currentTimezone) => {
        let abbr;
        const timezones = JSON.parse(
          fs.readFileSync("assets/timezone.json", { encoding: "utf-8" })
        );
        timezones.forEach((timezone) => {
          timezone.utc.forEach((timezoneName) => {
            if (timezoneName === currentTimezone) {
              abbr = timezone.abbr;
            }
          });
        });
        return abbr;
      };
      return getAbbr(Intl.DateTimeFormat().resolvedOptions().timeZone);
    },
  },
  {
    type: "input",
    name: "CONVERT_TO_TIMEZONE",
    message: "CONVERT_TO_TIMEZONE",
    validate(time) {
      const regex = /^([A-Z]+)$/;
      if (regex.test(time)) return true;
      return "please enter in correct format";
    },
    default() {
      return "PST";
    },
  },
];

(async function () {
  let answers = await inquirer.prompt(questions);
  try {
    const convertedTime = convertTimezone(
      answers.CURRENT_TIME,
      answers.CURRENT_TIMEZONE,
      answers.CONVERT_TO_TIMEZONE
    );

    console.log("CONVERTED_TIMEZONE: ", convertedTime);
  } catch (error) {
    console.log(error.message);
  }
})();
