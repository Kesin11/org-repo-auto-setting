import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
const checkboxSecretStr = "<!-- poc-checkbox -->"
const checkboxCheckedDetectStr = `- \\[x\\] ${checkboxSecretStr}`
const branchCheckboxSecret = "<!-- poc-branch -->"
const branchCheckboxPattern = `- \\[x\\] ${branchCheckboxSecret}`
const repositoryCheckboxSecret = "<!-- poc-repository -->"
const repositoryCheckboxPattern = `- \\[x\\] ${repositoryCheckboxSecret}`
const initSetupIssueTitle = "Initial setup issue"

// for github preview api
// see: https://developer.github.com/v3/repos/branches/#update-branch-protection
const previewHeaders = { accept: 'application/vnd.github.hellcat-preview+json,application/vnd.github.luke-cage-preview+json,application/vnd.github.zzzax-preview+json' }

// TODO: show multiple config preset with separating each settings
// TODO: detect choice and setup with mutual excluesive.
// TODO: Add github default config

export = (app: Application) => {
  // app.on('issues', async (context) => {
  //   app.log('issues *')
  //   app.log(context)
  // })

  // Create initial setup issue when repository created
  app.on('repository.created', async (context) => {
    app.log('repository.created')
    app.log(context)
    const param = context.repo({
      title: initSetupIssueTitle,
      body: `Text here\n- [ ] ${checkboxSecretStr} setup labels`
    })
    await context.github.issues.create(param)
  })

  app.on('issue_comment.created', async (context) => {
    if (context.isBot) return

    app.log('issue_comment.created')
    app.log(context)

    if (context.payload.issue.title !== initSetupIssueTitle) return
    if (!context.payload.comment.body.match(new RegExp('setup'))) return

    // Setup labels when labels check box is checked.
    if(context.payload.issue.body.match(new RegExp(checkboxCheckedDetectStr))) {
      await setupLabel(context)
    }

    // Setup branch protection when branch check box is checked.
    if(context.payload.issue.body.match(new RegExp(branchCheckboxPattern))) {
      await setupBranch(context)
    }

    // Setup repository settings when repository check box is checked.
    if(context.payload.issue.body.match(new RegExp(repositoryCheckboxPattern))) {
      await setupRepository(context)
    }

    const param = context.issue({
      body: `Setup finished!`
    })
    await context.github.issues.createComment(param)
  })

  const setupLabel = async (context: Context) => {
    const listLabelParam = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
    }
    const labels = await context.github.issues.listLabelsForRepo(listLabelParam)
    // delete all of labels
    for (const label of labels.data) {
      const param = context.repo({
        name: label.name
      })
      context.log(`Delete label: { name: ${label.name} }`)
      await context.github.issues.deleteLabel(param)
    }

    // setup new labels
    const config = loadConfig('default')
    const newLabels = config.labels
    for (const label of newLabels ) {
      const param = context.repo({
        ...label
      })
      context.log(`Create label: { name: ${label.name}, color: ${label.color} }`)
      await context.github.issues.createLabel(param)
    }
  }

  const loadConfig = (configName: string) => {
    const filePath = path.join(__dirname, '..', 'configs', `${configName}.yml`)
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))
    return config
  }

  const setupBranch = async (context: Context) => {
    const config = loadConfig('default')
    const branches = config.branches

    return Promise.all(
      branches
        .filter((branch: any) => branch.protection !== undefined)
        .map(((branch: any) => {
          context.log(`setup branch protection: ${branch.name}`)
          const params = context.repo({
            headers: previewHeaders,
            branch: branch.name,
            ...branch.protection,
          })

          context.github.repos.updateBranchProtection(params)
        }))
    )
  }

  const setupRepository = async (context: Context) => {
    // setup repository
    const config = loadConfig('default')
    const commonParams = context.repo()
    const params = context.repo({
      // NOTE: workaround. oktokit doc says not required, but actually it required.
      name: commonParams.repo,
      ...config.repository
    })
    context.log('setup repository')
    await context.github.repos.update(params)
  }

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
