import nock from 'nock'
import { Probot } from 'probot'
import myProbotApp from '../../src'
import payload from '../fixtures/issues.opened.json'
import labelsPayload from '../fixtures/labels.default.json'

nock.disableNetConnect()
jest.setTimeout(10000)

const orgRepo = `hiimbex/testing-things`
const protectionBranch = 'master'

describe('My Probot app', () => {
  let probot: Probot

  beforeEach(() => {
    probot = new Probot({})
    // Load our app into probot
    const app = probot.load(myProbotApp)

    // just return a test token
    app.app = () => 'test'
  })

  describe('on repository.created', () => {
    test('creates a issue when an repository is created', async () => {
      // Test that a create new issue
      nock('https://api.github.com')
        .post(`/repos/${orgRepo}/issues`, (body: any) => {
          expect(body).not.toBeNull() // FIXME: check body content
          return true
        })
        .reply(200)

      // Test that a get initial labels
      nock('https://api.github.com')
        .get(`/repos/${orgRepo}/labels`)
        .reply(200, labelsPayload)

      // Test that a delete initial labels
      for (const label of labelsPayload.map((label) => encodeURI(label.name))) {
        nock('https://api.github.com')
          .delete(`/repos/${orgRepo}/labels/${label}`)
          .reply(204)
      }

      // Test that a create default labels
      nock('https://api.github.com')
        .persist() // allow many times
        .post(`/repos/${orgRepo}/labels`)
        .reply(200)

      // Test that a patch repository settings
      nock('https://api.github.com')
        .patch(`/repos/${orgRepo}`)
        .reply(200)

      // Test that a update protect branches
      nock('https://api.github.com')
        .put(`/repos/${orgRepo}/branches/${protectionBranch}/protection`)
        .reply(200)

      // Receive a webhook event
      await probot.receive({ name: 'repository.created', payload })
      expect(nock.isDone())
    })
  })
})