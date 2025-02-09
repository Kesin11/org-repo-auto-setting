import { Context } from 'probot'
import { BranchConfig } from "../app_config"

// for github preview api
// see: https://developer.github.com/v3/repos/branches/#update-branch-protection
const previewHeaders = { accept: 'application/vnd.github.hellcat-preview+json,application/vnd.github.luke-cage-preview+json,application/vnd.github.zzzax-preview+json' }

export class Branches {
  constructor(public context: Context, public config: BranchConfig[]) { }

  // setup branches
  async setup() {
    // Clean all branch protection
    await this.removeAllBranchProtection()

    // Create branch protection
    const branches = this.config
    return Promise.all(
      branches
        .filter((branch) => branch.protection !== undefined)
        .map(((branch) => {
          this.context.log(`Setup branch protection: ${branch.name}`)
          const params = this.context.repo({
            headers: previewHeaders,
            branch: branch.name,
            ...branch.protection as any,
          })

          return this.context.github.repos.updateBranchProtection(params)
        }))
    )
  }

  async removeAllBranchProtection() {
    const params = this.context.repo({
      protected: true
    })
    const protectedBranches = await this.context.github.repos.listBranches(params)
    await Promise.all(
      protectedBranches.data.map((branch) => {
        this.context.log(`Remove branch protection: ${branch.name}`)
        const params = this.context.repo({
          branch: branch.name
        })
        return this.context.github.repos.removeBranchProtection(params)
      })
    )
  }
}