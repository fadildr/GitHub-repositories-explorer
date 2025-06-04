"use client";

import { SearchView } from "@/components/search/search-view";
import { RepositoryList } from "@/components/repository/repository-list";
import { useUserSearch } from "@/hooks/use-user-search";
import { useUserRepositories } from "@/hooks/use-user-repositories";

export default function HomePage() {
  const { users, isSearching, searchError, searchUsers } = useUserSearch();

  const {
    selectedUser,
    repositories,
    isLoadingRepos,
    reposError,
    loadUserRepositories,
    clearUserSelection,
  } = useUserRepositories();

  const isSearchView = !selectedUser;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {isSearchView ? (
            <SearchView
              users={users}
              isSearching={isSearching}
              searchError={searchError}
              onSearch={searchUsers}
              onUserSelect={loadUserRepositories}
            />
          ) : (
            <RepositoryList
              user={selectedUser}
              repositories={repositories}
              isLoading={isLoadingRepos}
              error={reposError}
              onBack={clearUserSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
