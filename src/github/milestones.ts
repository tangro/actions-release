import { GitHubContext, github } from '@tangro/tangro-github-toolkit';
import { MilestoneEvent } from '../types';

export async function setMilestoneState({
  context,
  state
}: {
  context: GitHubContext<MilestoneEvent>;
  state: 'open' | 'closed';
}) {
  const [owner, repo] = context.repository.split('/');

  await github.issues.updateMilestone({
    milestone_number: context.event.milestone.number,
    owner,
    repo,
    state
  });
}
