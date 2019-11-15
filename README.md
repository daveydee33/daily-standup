# daily-standup

Node command line utility to put our daily standup task and status into Confluence Wiki format.

# Usage

Run the CLI app

```
node dsItem.js
```

Copy and paste the output into Confluence page Wiki Markup editor.

On a Confluence page, click to Edit the page, and then Insert > Markup (or Cmd+Shift+d) and paste the output from the command.

# Dependencies

- [Inquirer](https://github.com/SBoudrias/Inquirer.js) for nicer command line input
- [Axios](https://github.com/axios/axios) for fetching titles
