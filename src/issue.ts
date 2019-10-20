import { Context } from 'probot'
import { AppConfig } from './app_config'

const initSetupIssueTitle = "Initial setup issue"

export class Issue {
  constructor(public context: Context, public appConfigs: AppConfig[]) { }

  async createIssue() {
    const param = this.context.repo({
      title: initSetupIssueTitle,
      body: this.issueBody()
    })
    await this.context.github.issues.create(param)
  }

  async createComment(body: string) {
    const param = this.context.issue({
      body: body
    })
    await this.context.github.issues.createComment(param)
  }

  issueBody() {
    const header = `
    If you want to restore GitHub default settings or other config, click checkbox.
    `
    
    const checkboxSections = this.appConfigs.map((config) => this.checkboxSection(config)).join('')

    const footer = `
    If you don't wnat to restore settings or after click checkbox, please close this issue.
    `

    return [header, checkboxSections, footer].join("\n\n")
  }

  checkboxSection(config: AppConfig) {
    const desc = config.description
    const rows = [ `- [ ] <!-- ${desc.name}-checkbox --> ${desc.name}` ]
    if (desc.label) {
      rows.push(`  - ${desc.label}`)
    }
    if (desc.repository) {
      rows.push(`  - ${desc.repository}`)
    }
    if (desc.branch) {
      rows.push(`  - ${desc.branch}`)
    }

    return rows.join('\n')
  }
}