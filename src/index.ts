import { Application } from 'probot' // eslint-disable-line no-unused-vars
const checkboxSecretStr = "<!-- poc-checkbox -->"
const checkboxCheckedDetectStr = `- \\[x\\] ${checkboxSecretStr}`
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
    const issueParameter = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      title: initSetupIssueTitle,
      body: `Text here\n- [ ] ${checkboxSecretStr} check box`
    }
    await context.github.issues.create(issueParameter)
  })

  // Response comment when check box is checked.
  app.on('issues.edited', async (context) => {
    app.log('issues.edited')
    app.log(context)

    if (context.payload.issue.title !== initSetupIssueTitle) return

    const matched = context.payload.issue.body.match(new RegExp(checkboxCheckedDetectStr))
    const issueParameter = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.issue.number,
      body: `checked!`
    }

    if (!matched) return

    await context.github.issues.createComment(issueParameter)
  })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
