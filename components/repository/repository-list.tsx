"use client";

import { UserProfile } from "@/components/profile/user-profile";
import { PinnedRepositories } from "@/components/repository/pinned-repositories";
import { ContributionGraph } from "@/components/activity/contribution-graph";
import { RecentActivity } from "@/components/activity/recent-activity";
import { LanguageStats } from "@/components/repository/language-stats";
import { PageHeader } from "@/components/ui/page-header";
import type { GitHubUser, GitHubRepository } from "@/types/github";

interface RepositoryListProps {
  user: GitHubUser;
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

export function RepositoryList({
  user,
  repositories,
  isLoading,
  error,
  onBack,
}: RepositoryListProps) {
  return (
    <div className="space-y-8">
      <PageHeader onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - User Profile */}
        <div className="lg:col-span-1 space-y-6">
          <UserProfile user={user} />
          <LanguageStats repositories={repositories} isLoading={isLoading} />
          <RecentActivity username={user.login} />
        </div>

        {/* Main Content - Repositories & Activity */}
        <div className="lg:col-span-3 space-y-6">
          {/* Pinned Repositories */}
          <PinnedRepositories
            repositories={repositories}
            isLoading={isLoading}
            error={error}
          />

          {/* Contribution Graph */}
          <ContributionGraph
            username={user.login}
            repositoryCount={repositories.length}
          />
        </div>
      </div>
    </div>
  );
}
