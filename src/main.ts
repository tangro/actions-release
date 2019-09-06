import * as core from '@actions/core';
import { GitHubContext, setStatus } from '@tangro/tangro-github-toolkit';
import semver from 'semver';

import { MilestoneEvent } from './types';
import { hasRelease } from './github/hasRelease';
import { setMilestoneState } from './github/milestones';

if (!process.env.GITHUB_CONTEXT || process.env.GITHUB_CONTEXT.length === 0) {
  throw new Error(
    'You have to set the GITHUB_CONTEXT in your secrets configuration'
  );
}
async function run() {
  const context = JSON.parse(process.env.GITHUB_CONTEXT || '') as GitHubContext<
    MilestoneEvent
  >;

  try {
    if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN.length === 0) {
      throw new Error(
        'You have to set the GITHUB_TOKEN in your secrets configuration'
      );
    }

    const version = context.event.milestone.title;
    const openIssues = context.event.milestone.open_isues;
    if (!semver.valid(version)) {
      await setStatus({
        context,
        step: 'release',
        state: 'failure',
        description: 'Title is not a valid semver version'
      });

      throw new Error(
        `The title is no valid semver version. Please fix. The title is: ${version}`
      );
    } else if (openIssues > 0) {
      await setStatus({
        context,
        step: 'release',
        state: 'failure',
        description: 'Close the open issues/PRs first'
      });

      if (openIssues > 1) {
        throw new Error(
          `There are ${openIssues} open issues or pull requests for this milestone. Please close them first.`
        );
      } else {
        throw new Error(
          `There ist one open issue or pull request for this milestone. Please close it first.`
        );
      }
    } else if (hasRelease({ context, version })) {
      await setStatus({
        context,
        step: 'release',
        state: 'failure',
        description: `There already exists a release: ${version}`
      });

      throw new Error(`
        There already exists a release with the version ${version}. Please remove this release, or choose a different version.
      `);
    } else if (core.getInput('step') === 'release') {
    } else {
      await setStatus({
        context,
        step: 'release',
        state: 'pending',
        description: 'currently running'
      });
    }
  } catch (error) {
    await setMilestoneState({
      context,
      state: 'open'
    });
    core.setFailed(error.message);
  }
}

run();
