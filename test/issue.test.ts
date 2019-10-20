import { Issue } from '../src/issue'
import { AppConfig } from '../src/app_config'

describe('Issue', () => {
  const config = new AppConfig('default')
  const context = jest.fn()
  const issue = new Issue(context as any, [config])

  describe('checkboxSection', () => {
    test('created string', async () => {
      const actual = issue.checkboxSection(config)
      expect(actual).toBe(
`- [ ] <!-- Default-checkbox --> Default
  - Setup \`WIP\` and \`In Review\` labels.
  - Disable wiki and projects.
  - Protect master branch.`
      )
    })
  })
})