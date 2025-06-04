import { useState, useCallback } from "react";
import { githubAPI } from "@/lib/github-api";
import type { GitHubUser, GitHubRepository } from "@/types/github";

export const useUserRepositories = () => {
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);

  const loadUserRepositories = useCallback(async (user: GitHubUser) => {
    setIsLoadingRepos(true);
    setReposError(null);
    setRepositories([]);

    try {
      const [userDetails, repositories] = await Promise.all([
        githubAPI.getUserDetails(user.login),
        githubAPI.getUserRepositories(user.login),
      ]);

      setSelectedUser(userDetails);
      setRepositories(repositories);
    } catch (error) {
      console.error("Repository fetch error:", error);
      setReposError("Failed to load repositories. Please try again.");
      setSelectedUser(user); // Fallback to basic user info
    } finally {
      setIsLoadingRepos(false);
    }
  }, []);

  const clearUserSelection = useCallback(() => {
    setSelectedUser(null);
    setRepositories([]);
    setReposError(null);
  }, []);

  return {
    selectedUser,
    repositories,
    isLoadingRepos,
    reposError,
    loadUserRepositories,
    clearUserSelection,
  };
};
