import { Context } from 'probot'
import { BranchConfig } from "../app_config"

// for github preview api
// see: https://developer.github.com/v3/repos/branches/#update-branch-protection
const previewHeaders = { accept: 'application/vnd.github.hellcat-preview+json,application/vnd.github.luke-cage-preview+json,application/vnd.github.zzzax-preview+json' }

export class Branches {
  constructor(public context: Context, public config: BranchConfig[]) { }

  // setup branches
  async setup() {
    const branches = this.config

    return Promise.all(
      branches
        .filter((branch) => branch.protection !== undefined)
        .map(((branch) => {
          this.context.log(`setup branch protection: ${branch.name}`)
          const params = this.context.repo({
            headers: previewHeaders,
            branch: branch.name,
            ...branch.protection as any,
          })

          return this.context.github.repos.updateBranchProtection(params)
        }))
    )
  }
}