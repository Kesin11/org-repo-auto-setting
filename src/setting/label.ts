import { Context } from 'probot'
import { LabelConfig } from "../app_config"

export class Label {
  constructor(public context: Context, public config: LabelConfig[]) { }

  async setup() {
    await this.deleteAllLabels()
    await this.createNewLabels()
  }

  // delete all of labels
  async deleteAllLabels() {
    const listLabelParam = {
      owner: this.context.payload.repository.owner.login,
      repo: this.context.payload.repository.name,
    }
    const labels = await this.context.github.issues.listLabelsForRepo(listLabelParam)
    await Promise.all(
      labels.data.map((label) => {
        const param = this.context.repo({
          name: label.name
        })
        this.context.log(`Delete label: { name: ${label.name} }`)
        return this.context.github.issues.deleteLabel(param)
      })
    )
  }

  // setup new labels
  async createNewLabels() {
    await Promise.all(
      this.config.map((label) => {
        const param = this.context.repo({
          ...label
        })
        this.context.log(`Create label: { name: ${label.name}, color: ${label.color} }`)
        return this.context.github.issues.createLabel(param)
      })
    )
  }
}