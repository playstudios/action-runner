const assert = require('assert')
const core = require('@actions/core')
const execa = require('execa')
const fs = require('fs').promises
const yaml = require('yaml')
const path = require('path')

;(async () => {
  try {
    const token = core.getInput('repo-token')
    const action = core.getInput('action')
    const [repo, ref] = action.split('@')
    const repoDir = path.resolve(`../${action}`)

    assert.ok(ref)

    core.startGroup('Checkout action')
    if (await fs.access(repoDir).catch(() => false)) {
      core.info('action was already checked out')
    } else {
      await fs.mkdir(repoDir, { recursive: true })
      await execa.command(
        `git clone -b ${ref} --depth 1 -c advice.detachedHead=false https://_:${token}@github.com/${repo}.git ${repoDir}`,
        {
          stdio: 'inherit',
        },
      )
    }
    core.endGroup('Checkout action')

    const manifest = yaml.parse(await fs.readFile(`${repoDir}/action.yml`, 'utf-8'))
    await execa.command(`node ${repoDir}/${manifest.runs.main}`, { stdio: 'inherit' })
  } catch (e) {
    core.setFailed(e)
  }
})()
