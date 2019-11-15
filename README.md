# daily-standup

Node command line utility to put our daily standup task information and status into Confluence Wiki format.

# Setup

- You need to have a successful login to the Jira page from Chrome first.
- Set the `URL_PREFIX` value in the `dsItem.js` script first. This is the Jira URL - eg: `"https://pm.axa-asia.com/browse/"`

# Usage

Run the CLI app

```
node dsItem.js
```

Alternatively you can run it with the Jira storyID as the first command line argument. eg:

```
node dsItem.js SGIAASCM-999
```

Copy and paste the output into Confluence page Wiki Markup editor.

On a Confluence page, click to Edit the page, and then Insert > Markup (or Cmd+Shift+d) and paste the output from the command.

# Tech Used

- [Inquirer](https://github.com/SBoudrias/Inquirer.js) for nicer command line input
- [Axios](https://github.com/axios/axios) for fetching the Jira page by url
- [Cheerio](https://github.com/cheeriojs/cheerio) for parsing the return HTML for the description text
- [chrome-cookies-secure](https://github.com/bertrandom/chrome-cookies-secure) to retrieve the JSESSIONID cookie value from Chrome
- **https** from NodeJS to handle an issue and ignore self-signed SSL cert
