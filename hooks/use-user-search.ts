import { useState, useCallback } from "react";
import { githubAPI } from "@/lib/github-api";
import type { GitHubUser } from "@/types/github";

export const useUserSearch = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const users = await githubAPI.searchUsers(query);
      setUsers(users);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to search users. Please try again.");
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setUsers([]);
    setSearchError(null);
  }, []);

  return {
    users,
    isSearching,
    searchError,
    searchUsers,
    clearSearch
  };
};