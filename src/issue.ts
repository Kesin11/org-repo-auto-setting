import { Context } from 'probot'
import { AppConfig } from './app_config'

const initSetupIssueTitle = "Initial setup issue"

export class Issue {
  constructor(public context: Context, public appConfigs: AppConfig[]) { }

  async createIssue() {
    const body = ``
    const param = this.context.repo({
      title: initSetupIssueTitle,
      body: body
      // body: `Text here\n- [ ] ${checkboxSecretStr} setup labels`
    })
    await this.context.github.issues.create(param)
  }

  async createComment(body: string) {
    const param = this.context.issue({
      body: body
    })
    await this.context.github.issues.createComment(param)
  }
}