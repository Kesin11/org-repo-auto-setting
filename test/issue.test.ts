import { Issue } from '../src/issue'
import { AppConfig } from '../src/app_config'

describe('Issue', () => {
  const configs = AppConfig.createAllConfigs()
  const context = jest.fn()
  const issue = new Issue(context as any, configs)

  describe('checkboxSection', () => {
    test('created string', async () => {
      const defaultConfig = new AppConfig('default')
      const actual = issue.checkboxSection(defaultConfig)
      expect(actual).toBe(
`- [ ] <!-- Default-checkbox --> Default
  - Setup \`WIP\` and \`In Review\` labels.
  - Disable wiki and projects.
  - Protect master branch.
`
      )
    })
  })

  test('getClickedConfig', async () => {
    const editedIssueBody = `- [ ] <!-- Default-checkbox --> Default
  - Setup \`WIP\` and \`In Review\` labels.
  - Disable wiki and projects.
  - Protect master branch.
- [x] <!-- GitHub default-checkbox --> GitHub default
  - GitHub default label set
  - enable wiki and projets.
  - No protect branch
`
    const actual = issue.getClickedConfig(editedIssueBody)
    const expectConfig = new AppConfig('github')

    expect(actual).toStrictEqual(expectConfig)
  })
})