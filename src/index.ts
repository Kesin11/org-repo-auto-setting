import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { AppConfig } from './app_config'
import { Label } from './setting/label'
import { Branches } from './setting/branches'
import { Repository } from './setting/repository'
import { Issue } from './issue'
const checkboxSecretStr = "<!-- poc-checkbox -->"
const checkboxCheckedDetectStr = `- \\[x\\] ${checkboxSecretStr}`
const branchCheckboxSecret = "<!-- poc-branch -->"
const branchCheckboxPattern = `- \\[x\\] ${branchCheckboxSecret}`
const repositoryCheckboxSecret = "<!-- poc-repository -->"
const repositoryCheckboxPattern = `- \\[x\\] ${repositoryCheckboxSecret}`
const initSetupIssueTitle = "Initial setup issue"

export = (app: Application) => {
  // app.on('issues', async (context) => {
  //   app.log('issues *')
  //   app.log(context)
  // })

  // Create initial setup issue when repository created
  app.on('repository.created', async (context) => {
    app.log('repository.created')
    app.log(context)

    const allConfigs = AppConfig.createAllConfigs()
    const issue = new Issue(context, allConfigs)
    await issue.createIssue()

    const config = new AppConfig('default')
    const label = new Label(context, config.labels)
    await label.setup()

    // TODO: setup repository
    // TODO: setup branch
  })

  app.on('issue_comment.created', async (context) => {
    if (context.isBot) return

    app.log('issue_comment.created')
    app.log(context)

    if (context.payload.issue.title !== initSetupIssueTitle) return
    if (!context.payload.comment.body.match(new RegExp('setup'))) return

    const config = new AppConfig('default')

    // Setup labels when labels check box is checked.
    if(context.payload.issue.body.match(new RegExp(checkboxCheckedDetectStr))) {
      const label = new Label(context, config.labels)
      await label.setup()
    }

    // Setup branch protection when branch check box is checked.
    if(context.payload.issue.body.match(new RegExp(branchCheckboxPattern))) {
      const branch = new Branches(context, config.branches)
      await branch.setup()
    }

    // Setup repository settings when repository check box is checked.
    if(context.payload.issue.body.match(new RegExp(repositoryCheckboxPattern))) {
      const repository = new Repository(context, config.repository)
      await repository.setup()
    }

    // TODO: correct all config yaml
    const issue = new Issue(context, [config])
    await issue.createComment('Setup finished!')
  })

  // const githubDefaultLables = [
  //   {
  //     "id": 1578971287,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMjg3",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/bug",
  //     "name": "bug",
  //     "color": "d73a4a",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971289,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMjg5",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/documentation",
  //     "name": "documentation",
  //     "color": "0075ca",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971291,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMjkx",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/duplicate",
  //     "name": "duplicate",
  //     "color": "cfd3d7",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971293,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMjkz",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/enhancement",
  //     "name": "enhancement",
  //     "color": "a2eeef",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971298,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMjk4",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/good%20first%20issue",
  //     "name": "good first issue",
  //     "color": "7057ff",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971296,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMjk2",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/help%20wanted",
  //     "name": "help wanted",
  //     "color": "008672",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971301,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMzAx",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/invalid",
  //     "name": "invalid",
  //     "color": "e4e669",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971305,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMzA1",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/question",
  //     "name": "question",
  //     "color": "d876e3",
  //     "default": true
  //   },
  //   {
  //     "id": 1578971309,
  //     "node_id": "MDU6TGFiZWwxNTc4OTcxMzA5",
  //     "url": "https://api.github.com/repos/kesin11-bot-dev/probot-test-target4/labels/wontfix",
  //     "name": "wontfix",
  //     "color": "ffffff",
  //     "default": true
  //   }
  // ]


  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
