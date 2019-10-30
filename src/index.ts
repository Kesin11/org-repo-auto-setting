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

    const repository = new Repository(context, config.repository)
    await repository.setup()

    const branch = new Branches(context, config.branches)
    await branch.setup()
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
    await issue.closeIssue()
  })
}
