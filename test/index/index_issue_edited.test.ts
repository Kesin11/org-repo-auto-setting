import fs from 'fs'
import path from 'path'
import nock from 'nock'
import { Probot } from 'probot'
import myProbotApp from '../../src'
import originalPayload from '../fixtures/issues.edited.json'

nock.disableNetConnect()
jest.setTimeout(10000)

const orgRepo = `kesin11-bot-dev/probot-test-target7`

describe('My Probot app', () => {
  let probot: Probot
  let mockCert: any
  let payload: typeof originalPayload

  beforeAll((done) => {
    fs.readFile(path.join(__dirname, '..', 'fixtures', 'mock-cert.pem'), (err: any, cert: any) => {
      if (err) return done(err)
      mockCert = cert
      done()
    })
  })

  beforeEach(() => {
    probot = new Probot({ id: 123, cert: mockCert })
    // Load our app into probot
    const app = probot.load(myProbotApp)

    // Copy fixture
    payload = JSON.parse(JSON.stringify(originalPayload))

    nock('https://api.github.com')
      .post('/app/installations/1/access_tokens')
      .reply(200, { token: 'test' })
  })

  describe('on issue.edited', () => {
    test('Skip when any checkbox does not clicked', async () => {
      // Fix payload to mimic uncheck checkbox and any checkbox does not clicked.
      const notClickedPayload = JSON.parse(JSON.stringify(payload))
      notClickedPayload.issue.body = payload.changes.body.from
      notClickedPayload.changes.body.from = payload.issue.body

      // Receive a webhook event
      await probot.receive({ id: '1111-test', name: 'issues.edited', payload: notClickedPayload })
      expect(nock.isDone())
    })

    test.skip('Setup when GitHub config checkbox clicked', async () => {
      // Receive a webhook event
      await probot.receive({ id: '1111-test', name: 'issues.edited', payload: payload })
      expect(nock.isDone())
    })
  })
})