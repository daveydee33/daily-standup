const inquirer = require("inquirer");
const https = require("https");
const axios = require("axios");
const cheerio = require("cheerio");

// should move this to a config file
const URL_PREFIX = "";
const JSESSIONID = "";
// TEMP
// SGIAASCM-999

const printMarkup = values => {
  const { storyId, desc, status, color } = values;
  const url = `${URL_PREFIX}${storyId}`;
  const descEscaped = desc.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  const statusMacro = `{status:colour=${color}|title=${status}}`;

  console.log(`
In Confluence, click to Edit the page (or press E), then insert markup with Insert > Markup (Cmd + Shift + d).  Paste the following as Confluence Wiki Markup.

-----
* [${storyId}|${url}] ${descEscaped} ${statusMacro}
-----

`);
};

const fetchDescription = async storyId => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  const res = await axios.get(`${URL_PREFIX}${storyId}`, {
    headers: { Cookie: "JSESSIONID=04FCA4857B516637B7D1E9EC131FB1DC; " },
    httpsAgent: agent
  });
  const html = res.data;
  const $ = cheerio.load(html);
  const desc = $("#summary-val").text();
  return desc;
};

inquirer
  .prompt([
    {
      name: "storyId",
      message: "ID of the user story from Jira?"
    },
    {
      type: "list",
      name: "status",
      message: "What is the status?",
      choices: [
        "In Progress",
        "PR in Develop",
        "Develop",
        "PR in Master",
        "Done",
        "To Raise PR in Develop",
        "To Be in Develop",
        "To Raise PR in Master",
        "To Be Done",
        "OTHER"
      ],
      default: "In Progress"
    },
    {
      type: "list",
      name: "color",
      message: "Color of the status indicator",
      choices: ["Gray", "Blue", "Green", "Red", "Yellow"],
      default: "Blue"
    }
  ])
  .then(async values => {
    // fetch user story description
    const desc = await fetchDescription(values.storyId);
    // add it to the values object
    values = { ...values, desc };
    // call function to print it all
    printMarkup(values);
  });
