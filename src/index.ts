import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { AppConfig } from './app_config'
import { Label } from './setting/label'
import { Branches } from './setting/branches'
import { Repository } from './setting/repository'
import { Issue } from './issue'
const initSetupIssueTitle = "Initial setup issue"

export = (app: Application) => {
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

  app.on('issues.edited', async (context) => {
    if (context.isBot) return

    app.log('issues.edited')
    app.log(context)

    // is not initial setup issue
    if (context.payload.issue.title !== initSetupIssueTitle) return

    const allConfigs = AppConfig.createAllConfigs()
    const issue = new Issue(context, allConfigs)

    const config = issue.getClickedConfig(context.payload.issue.body)
    if (!config) return

    // Setup labels
    const label = new Label(context, config.labels)
    await label.setup()

    // Setup repository settings
    const repository = new Repository(context, config.repository)
    await repository.setup()

    // Setup branch protection
    const branch = new Branches(context, config.branches)
    await branch.setup()

    await issue.createComment(`Setup ${config.description.name} finished!`)
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
