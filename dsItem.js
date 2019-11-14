// TODO:
// -- add a launch script somewhere?  ~/bin/dsItem
// -- optionally pass these values on command line - pass URL as first argument and skip the propmt, or pre-fill it
// -- error if no URL or desc provided (or default like TITLE)
// -- move this script (app?) to my bin directory or something
// -- prompt to ask for another?
// -- copy to clipboard - like pbcopy
// -- have default colors already
// -- fetch the title from the URL (but I can't do this because JIRA is behind a login/session)
// -- emoji or something fun
// -- make a UI for it and put it on Netlify
// -- put it in Github

// Sample values
// const url = "https://pm.axa-asia.com/browse/SGIAASCM-999";
// const desc = "[SLASH][SmartPlan, SmartCare] Check document template to not have calculations, should only be read-only"
// const status = "In Progress";

const inquirer = require("inquirer");

const doIt = values => {
  const { url, desc, status, color } = values;
  const id = url.split("/").pop();
  const descEscaped = desc.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  const statusMacro = `{status:colour=${color}|title=${status}}`;
  //   const statusMacro = `{status:colour=Gray|title=${status}|subtle=false}`;  // status macro -- https://confluence.atlassian.com/doc/status-macro-223222355.html

  console.log(`
In Confluence, insert Markup with Insert > Markup (Cmd + Shift + d).

Confluence Wiki Markup

* [${id}|${url}] ${descEscaped} ${statusMacro}

`);
};

inquirer
  .prompt([
    {
      name: "url",
      message: "URL of the user story from Jira?"
    },
    {
      name: "desc",
      message: "Description of the user story?"
    },
    {
      type: "list",
      name: "status",
      message: "What is the status?",
      choices: ["In Progress", "To Be Done", "Done"],
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
  .then(values => {
    doIt(values);
  });
