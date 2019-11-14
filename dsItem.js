const inquirer = require("inquirer");

const doIt = values => {
  const { url, desc, status, color } = values;
  const id = url.split("/").pop();
  const descEscaped = desc.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  const statusMacro = `{status:colour=${color}|title=${status}}`;

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
