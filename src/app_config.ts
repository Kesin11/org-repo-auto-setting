import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

export type LabelConfig = {
  name: string
  color: string
 }
export type RepositoryConfig = { [key: string]: string }
export type BranchConfig = {
  name: string
  protection: { [key: string]: string }
}
export type DescriptionConfig = {
  name: string
  label?: string
  repository?: string
  branch?: string
}

export class AppConfig {
  labels: LabelConfig[]
  repository: RepositoryConfig
  branches: BranchConfig[]
  description: DescriptionConfig

  constructor (configName: string) {
    const filePath = path.join(__dirname, '..', 'configs', `${configName}.yml`)
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))

    this.labels = config.labels || [ {} ]
    this.repository = config.repository || {}
    this.branches = config.branches || [ {} ]
    this.description = config.description || {}
  }

  static createAllConfigs () {
    const dirPath = path.join(__dirname, '..', 'configs')
    const configNames = fs.readdirSync(dirPath)
      .map((file) => path.basename(file, '.yml'))

    return configNames.map((configName) => new AppConfig(configName))
  }
}
