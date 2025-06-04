"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RepositoryCard } from "@/components/repository/repository-card";
import { ErrorMessage } from "@/components/ui/error-message";
import type { GitHubRepository } from "@/types/github";

interface PopularRepositoriesProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
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
      <p className="text-gray-500 dark:text-gray-400">
        No repositories found for this user.
      </p>
    </CardContent>
  </Card>
);

export function PopularRepositories({
  repositories,
  isLoading,
  error,
}: PopularRepositoriesProps) {
  const popularRepos = repositories.slice(0, 6);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Popular repositories</h2>
          <Button variant="ghost" size="sm" className="text-blue-500">
            Customize your pins
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
          <h2 className="text-xl font-semibold">Popular repositories</h2>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Popular repositories</h2>
        <Button variant="ghost" size="sm" className="text-blue-500">
          Customize your pins
        </Button>
      </div>

      {popularRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularRepos.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>
      ) : (
        <EmptyRepositories />
      )}
    </div>
  );
}
