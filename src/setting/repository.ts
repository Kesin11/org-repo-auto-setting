import { Context } from 'probot'
import { RepositoryConfig } from "../app_config"

export class Repository {
  constructor(public context: Context, public config: RepositoryConfig) { }

  // setup repository
  async setup() {
    const commonParams = this.context.repo()
    const params = this.context.repo({
      // NOTE: Adding name is workaround.
      // oktokit document says it not required, but actually required.
      name: commonParams.repo,
      ...this.config
    })
    this.context.log('Setup repository settings', this.config)
    await this.context.github.repos.update(params)
  }
}