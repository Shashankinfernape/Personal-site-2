// src/hooks/useGitHubSync.ts
import { useEffect, useState } from 'react';
import { useWorldStore } from '../store/useWorldStore';

interface GitHubRepoResponse {
  name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  language: string | null;
  html_url: string;
}

export const useGitHubSync = (username: string = 'Shashankinfernape') => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncedCount, setSyncedCount] = useState<number>(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const updateProjectGitHubStats = useWorldStore((s) => s.updateProjectGitHubStats);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = `gh_repos_cache_${username}`;
    const cacheTimeKey = `gh_repos_cache_time_${username}`;

    const syncRepos = async () => {
      setIsSyncing(true);
      setSyncError(null);

      try {
        // Check cache (valid for 15 minutes)
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        const now = Date.now();

        if (cachedData && cachedTime && now - parseInt(cachedTime, 10) < 15 * 60 * 1000) {
          const repos: GitHubRepoResponse[] = JSON.parse(cachedData);
          if (isMounted) {
            applyRepos(repos);
            setIsSyncing(false);
            return;
          }
        }

        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!res.ok) {
          // If rate limited or network issue, fallback to cache if available
          if (cachedData) {
            const repos: GitHubRepoResponse[] = JSON.parse(cachedData);
            if (isMounted) applyRepos(repos);
          }
          throw new Error(`GitHub API returned status ${res.status}`);
        }

        const data: GitHubRepoResponse[] = await res.json();
        if (Array.isArray(data) && isMounted) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          localStorage.setItem(cacheTimeKey, now.toString());
          applyRepos(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setSyncError(err?.message || 'Failed to sync with GitHub API');
        }
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };

    const applyRepos = (repos: GitHubRepoResponse[]) => {
      let matched = 0;
      repos.forEach((repo) => {
        updateProjectGitHubStats(repo.name, {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          openIssues: repo.open_issues_count,
          updatedAt: repo.updated_at.split('T')[0],
          language: repo.language || 'Code',
        });
        matched++;
      });
      setSyncedCount(matched);
    };

    syncRepos();

    return () => {
      isMounted = false;
    };
  }, [username, updateProjectGitHubStats]);

  return { isSyncing, syncedCount, syncError };
};
