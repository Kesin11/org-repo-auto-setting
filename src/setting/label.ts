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
    for (const label of labels.data) {
      const param = this.context.repo({
        name: label.name
      })
      this.context.log(`Delete label: { name: ${label.name} }`)
      await this.context.github.issues.deleteLabel(param)
    }
  }

  // setup new labels
  async createNewLabels() {
    for (const label of this.config ) {
      const param = this.context.repo({
        ...label
      })
      this.context.log(`Create label: { name: ${label.name}, color: ${label.color} }`)
      await this.context.github.issues.createLabel(param)
    }
  }
}