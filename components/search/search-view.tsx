import { SearchInput } from "@/components/search/search-input";
import { UserList } from "@/components/search/user-list";
import { ErrorMessage } from "@/components/ui/error-message";
import type { GitHubUser } from "@/types/github";

interface SearchViewProps {
  users: GitHubUser[];
  isSearching: boolean;
  searchError: string | null;
  onSearch: (query: string) => void;
  onUserSelect: (user: GitHubUser) => void;
}

export const SearchView = ({
  users,
  isSearching,
  searchError,
  onSearch,
  onUserSelect,
}: SearchViewProps) => (
  <>
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        GitHub Explorer
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Search for GitHub users and explore their repositories
      </p>
    </header>

    <div className="space-y-6">
      <SearchInput onSearch={onSearch} isLoading={isSearching} />

      {searchError && <ErrorMessage message={searchError} />}

      <UserList
        users={users}
        onUserSelect={onUserSelect}
        isLoading={isSearching}
      />
    </div>
  </>
);
