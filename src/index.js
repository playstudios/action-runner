const core = require('@actions/core')
const { ok } = require('assert')
const execa = require('execa')
const fs = require('fs').promises
const yaml = require('yaml')

;(async () => {
  try {
    const token = core.getInput('repo-token')
    const [action, version] = core.getInput('action').split('@')
    const repoDir = core.getInput('checkout-path') || `../${action}`

    ok(version)

    core.startGroup('Checkout action')
    await execa.command(
      `git clone -b ${version} --depth 1 https://_:${token}@github.com/playstudios/github-actions.git ${repoDir}`,
      {
        stdio: 'inherit',
      },
    )
    const manifest = yaml.parse(await fs.readFile(`${repoDir}/${action}/action.yml`, 'utf-8'))
    core.endGroup('Checkout action')

    await execa.command(`node ${repoDir}/${action}/${manifest.runs.main}`, { stdio: 'inherit' })
  } catch (e) {
    core.setFailed(e)
  }
})()
