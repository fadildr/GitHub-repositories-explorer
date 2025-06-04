"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, ExternalLink, Pin } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { getLanguageColor, formatNumber } from "@/lib/formatting";
import type { GitHubRepository } from "@/types/github";

interface PinnedRepositoriesProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
}

const PinnedRepositoryCard = ({
  repository,
}: {
  repository: GitHubRepository;
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-gray-400" />
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-semibold hover:underline flex items-center gap-1"
            >
              {repository.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <Badge variant="outline" className="text-xs">
            {repository.private ? "Private" : "Public"}
          </Badge>
        </div>

        {repository.description ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {repository.description}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
            No description available
          </p>
        )}

        {repository.fork && (
          <div className="flex items-center gap-1 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <GitFork className="h-3 w-3" />
            <span>Forked from {repository.full_name.split("/")[0]}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {repository.language && (
              <div className="flex items-center gap-1">
                <span
                  className={`h-3 w-3 rounded-full ${getLanguageColor(
                    repository.language
                  )}`}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {repository.language}
                </span>
              </div>
            )}

            {repository.stargazers_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Star className="h-3 w-3" />
                <span>{formatNumber(repository.stargazers_count)}</span>
              </div>
            )}

            {repository.forks_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <GitFork className="h-3 w-3" />
                <span>{formatNumber(repository.forks_count)}</span>
              </div>
            )}
          </div>

          {repository.topics && repository.topics.length > 0 && (
            <div className="flex gap-1">
              {repository.topics.slice(0, 2).map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="text-xs px-2 py-0"
                >
                  {topic}
                </Badge>
              ))}
              {repository.topics.length > 2 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  +{repository.topics.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {repository.homepage && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <a
              href={repository.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline flex items-center gap-1"
            >
              🔗 {repository.homepage}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const EmptyRepositories = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Pin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No pinned repositories
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Pin repositories to showcase your best work
      </p>
    </CardContent>
  </Card>
);

export function PinnedRepositories({
  repositories,
  isLoading,
  error,
}: PinnedRepositoriesProps) {
  const [showAll, setShowAll] = useState(false);

  // Sort repositories by stars and recent activity to simulate "pinned" repos
  const sortedRepos = [...repositories].sort((a, b) => {
    // Sort by stars first, then by recent updates
    const starsA = a.stargazers_count || 0;
    const starsB = b.stargazers_count || 0;
    if (starsA !== starsB) return starsB - starsA;

    const dateA = new Date(a.updated_at).getTime();
    const dateB = new Date(b.updated_at).getTime();
    return dateB - dateA;
  });

  const pinnedRepos = showAll
    ? sortedRepos.slice(0, 12)
    : sortedRepos.slice(0, 6);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Pin className="h-5 w-5" />
            Pinned repositories
          </h2>
          <Button variant="ghost" size="sm" className="text-blue-500" disabled>
            <LoadingSpinner size="sm" className="mr-2" />
            Loading...
          </Button>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Pin className="h-5 w-5" />
            Pinned repositories
          </h2>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Pin className="h-5 w-5" />
          Pinned repositories
          {pinnedRepos.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pinnedRepos.length}
            </Badge>
          )}
        </h2>
        <Button variant="ghost" size="sm" className="text-blue-500">
          Customize your pins
        </Button>
      </div>

      {pinnedRepos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedRepos.map((repo) => (
              <PinnedRepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>

          {sortedRepos.length > 6 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="w-full md:w-auto"
              >
                {showAll
                  ? "Show less"
                  : `Show ${Math.min(
                      6,
                      sortedRepos.length - 6
                    )} more repositories`}
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyRepositories />
      )}
    </div>
  );
}
