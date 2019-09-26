import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
const checkboxSecretStr = "<!-- poc-checkbox -->"
const checkboxCheckedDetectStr = `- \\[x\\] ${checkboxSecretStr}`
const initSetupIssueTitle = "Initial setup issue"
const newLabels = [
  { name: "WIP", color: "ffff00" },
  { name: "InReview", color: "0000ff" },
]

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
      body: `Text here\n- [ ] ${checkboxSecretStr} setup labels`
    }
    await context.github.issues.create(issueParameter)
  })

  // Response comment when check box is checked.
  app.on('issues.edited', async (context) => {
    app.log('issues.edited')
    app.log(context)

    if (context.payload.issue.title !== initSetupIssueTitle) return

    const matched = context.payload.issue.body.match(new RegExp(checkboxCheckedDetectStr))
    if (!matched) return

    await setupLabel(app, context)

    const issueParameter = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.issue.number,
      body: `Done setup labels!`
    }
    await context.github.issues.createComment(issueParameter)
  })

  const setupLabel = async (app:Application, context: Context) => {
    const listLabelParam = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
    }
    const labels = await context.github.issues.listLabelsForRepo(listLabelParam)
    // delete all of labels
    for (const label of labels.data) {
      const param = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name: label.name
      }
      app.log(`Delete label: { name: ${label.name} }`)
      await context.github.issues.deleteLabel(param)
    }

    // setup new labels
    for (const label of newLabels ) {
      const param = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name: label.name,
        color: label.color,
      }
      app.log(`Create label: { name: ${label.name}, color: ${label.color} }`)
      await context.github.issues.createLabel(param)
    }
  }

  // TODO: load config from .github/init_setup.yml

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
