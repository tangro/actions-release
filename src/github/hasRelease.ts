import { GitHubContext, github } from '@tangro/tangro-github-toolkit';

export async function hasRelease<E>({
  context,
  version
}: {
  context: GitHubContext<E>;
  version: string;
}) {
  const [owner, repo] = context.repository.split('/');

  const result = await github.repos.getReleaseByTag({
    owner,
    repo,
    tag: version
  });

  return result.status === 404;
}
