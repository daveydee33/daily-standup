const inquirer = require("inquirer");
const https = require("https");
const axios = require("axios");
const cheerio = require("cheerio");
const chrome = require("chrome-cookies-secure");

// should move this to a config file?
const URL_PREFIX = "https://pm.axa-asia.com/browse/";

const getSessionIdFromChromeCookies = url => {
  return new Promise((resolve, reject) => {
    chrome.getCookies(url, (err, cookies) => {
      if (err) {
        console.error(
          `Error trying to get JSESSIONID for that URL.  Might need to login from Chrome first? --> ${url}`,
          err
        );
        reject(err);
      }
      resolve(cookies.JSESSIONID);
    });
  });
};

const printMarkup = values => {
  const { url, storyId, desc, status, color } = values;
  const descEscaped = desc.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  const statusMacro = `{status:colour=${color}|title=${status}}`;

  console.log(`
In Confluence, click to Edit the page (or press E), then insert markup with Insert > Markup (Cmd + Shift + d).  Paste the following as Confluence Wiki Markup.

-----
* [${storyId}|${url}] ${descEscaped} ${statusMacro}
-----
`);
};

const fetchDescriptionFromJiraPage = async (storyId, jSessionId) => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  const res = await axios.get(`${URL_PREFIX}${storyId}`, {
    headers: { Cookie: `JSESSIONID=${jSessionId}` },
    httpsAgent: agent
  });
  const html = res.data;
  const $ = cheerio.load(html);
  const desc = $("#summary-val").text();
  return desc;
};

const questions = [
  {
    name: "storyId",
    message: "ID of the user story from Jira?",
    default: process.argv[2]
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
];

inquirer.prompt(questions).then(async values => {
  const url = `${URL_PREFIX}${values.storyId}`;

  // fetch the JSESSIONID from Chrome cookies
  const jSessionId = await getSessionIdFromChromeCookies(url);

  // fetch user story description from Jira url
  const desc = await fetchDescriptionFromJiraPage(values.storyId, jSessionId);

  values = { ...values, url, desc };

  // call function to print it all
  printMarkup(values);
});
