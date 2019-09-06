import { GitHubContext, github } from '@tangro/tangro-github-toolkit';

export async function hasRelease<E>({
  context,
  version
}: {
  context: GitHubContext<E>;
  version: string;
}) {
  const [owner, repo] = context.repository.split('/');

  try {
    await github.repos.getReleaseByTag({
      owner,
      repo,
      tag: version
    });

    return false;
  } catch (error) {
    return error.status !== 404;
  }
}
