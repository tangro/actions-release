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
    const result = await github.repos.getReleaseByTag({
      owner,
      repo,
      tag: version
    });

    console.log('result', result.status !== 404);
    return result.status !== 404;
  } catch (error) {
    console.log('error', error.status !== 404);
    return error.status !== 404;
  }
}
