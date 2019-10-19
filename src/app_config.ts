import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

export type LabelConfig = {
  name: string
  color: string
 }
export type RepositoryConfig = { [key: string]: string }
export type BranchConfig = { [key: string]: string }
export type IssueConfig = { [key: string]: string }

export class AppConfig {
  labels: LabelConfig[]
  repository: RepositoryConfig
  branches: BranchConfig[]
  issue: IssueConfig
  
  constructor(configName: string) {
    const filePath = path.join(__dirname, '..', 'configs', `${configName}.yml`)
    const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))

    this.labels = config.labels || [ {} ]
    this.repository = config.repository || {}
    this.branches = config.branches || [ {} ]
    this.issue = config.issue || {}
  }
}