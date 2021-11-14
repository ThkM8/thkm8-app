const getConfig = require('probot-config');
const { validate } = require('parse-commit-message')
const commitTypes = Object.keys(require('conventional-commit-types').types)


const DEFAULT_OPTS = {
  enabled: true,
  titleOnly: false,
  commitsOnly: false,
  titleAndCommits: false,
  anyCommit: false,
  scopes: null,
  types: null,
  allowMergeCommits: false,
  allowRevertCommits: false
};

const events = [
  'pull_request.opened',
  'pull_request.edited',
  'pull_request.synchronize',
];

function isSemanticMessage(message, validScopes, validTypes, allowMergeCommits, allowRevertCommits) {
  const isMergeCommit = message && message.startsWith('Merge')
  if (allowMergeCommits && isMergeCommit) return true

  const isRevertCommit = message && message.startsWith('Revert')
  if (allowRevertCommits && isRevertCommit) return true

  const { error, value: commits } = validate(message, true)

  if (error) {
    if (process.env.NODE_ENV !== 'test') console.error(error)
    return false
  }

  console.log('commits', commits)

  const [result] = commits
  const { scope: scopes, type } = result.header
  const isScopeValid = !validScopes || !scopes || scopes.split(',').map(scope => scope.trim()).every(scope => validScopes.includes(scope))
  return (validTypes || commitTypes).includes(type) && isScopeValid
};

async function getCommits (context) {
  const commits = await context.github.pullRequests.getCommits(context.repo({
    number: context.payload.pull_request.number
  }));
  return commits.data;
};

async function commitsAreSemantic (commits, scopes, types, allCommits = false, allowMergeCommits, allowRevertCommits) {
  return commits
    .map(element => element.commit)[allCommits ? 'every' : 'some'](commit => isSemanticMessage(commit.message, scopes, types, allowMergeCommits, allowRevertCommits))
}

const logic = async (context) => {
  context.log(context.payload )
  const { title, head } = context.payload.pull_request
  /*
  const userConfig = await getConfig(context, 'thkm8.yml', {})
  const isVanillaConfig = Object.keys(userConfig).length === 0
  const {
    enabled,
    titleOnly,
    commitsOnly,
    titleAndCommits,
    anyCommit,
    scopes,
    types,
    allowMergeCommits,
    allowRevertCommits
  } = Object.assign({}, DEFAULT_OPTS, userConfig)

  const hasSemanticTitle = isSemanticMessage(title, scopes, types)
  const commits = await getCommits(context)
  context.log('commits', commits);
  const hasSemanticCommits = await commitsAreSemantic(commits, scopes, types, (commitsOnly || titleAndCommits) && !anyCommit, allowMergeCommits, allowRevertCommits)
  const nonMergeCommits = commits.filter(element => !element.commit.message.startsWith('Merge'))

  let isSemantic

  if (!enabled) {
    isSemantic = true
  } else if (titleOnly) {
    isSemantic = hasSemanticTitle
  } else if (commitsOnly) {
    isSemantic = hasSemanticCommits
  } else if (titleAndCommits) {
    isSemantic = hasSemanticTitle && hasSemanticCommits
  } else if (isVanillaConfig && nonMergeCommits.length === 1) {
    // Watch out for cases where there's only commit and it's not semantic.
    // GitHub won't squash PRs that have only one commit.
    isSemantic = hasSemanticCommits
  } else {
    isSemantic = hasSemanticTitle || hasSemanticCommits
  }

  const state = isSemantic ? 'success' : 'failure'
  */

  function getDescription () {
    // if (!enabled) return 'skipped; check disabled in semantic.yml config'
    // if (!isSemantic && isVanillaConfig && nonMergeCommits.length === 1) return 'PR has only one non-merge commit and it\'s not semantic; add another commit before squashing'
    // if (isSemantic && titleAndCommits) return 'ready to be merged, squashed or rebased'
    // if (!isSemantic && titleAndCommits) return 'add a semantic commit AND PR title'
    // if (hasSemanticTitle && !commitsOnly) return 'ready to be squashed'
    // if (hasSemanticCommits && !titleOnly) return 'ready to be merged or rebased'
    // if (titleOnly) return 'add a semantic PR title'
    // if (commitsOnly && anyCommit) return 'add a semantic commit'
    // if (commitsOnly) return 'make sure every commit is semantic'
    return 'add a semantic commit or PR title'
  }

  const status = {
    sha: head.sha,
    state: 'success',
    target_url: 'https://github.com/ThkM8/thkm8-app',
    description: getDescription(),
    context: 'Pull Request Standard Check'
  }
  const result = await context.github.repos.createStatus(context.repo(status))
  return result
};

exports.events = events;
exports.logic = logic;
