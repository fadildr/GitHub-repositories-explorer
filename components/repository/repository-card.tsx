"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork } from "lucide-react";
import type { GitHubRepository } from "@/types/github";

interface RepositoryCardProps {
  repository: GitHubRepository;
}

const getLanguageColor = (language: string | null): string => {
  if (!language) return "bg-gray-500";

  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-500",
    HTML: "bg-red-500",
    CSS: "bg-purple-500",
    Python: "bg-blue-600",
    Java: "bg-orange-500",
    Go: "bg-cyan-500",
    Rust: "bg-orange-600",
    Swift: "bg-orange-400",
    Kotlin: "bg-purple-600",
  };

  return colors[language] || "bg-gray-500";
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-semibold hover:underline"
          >
            {repository.name}
          </a>
          <Badge variant="outline" className="text-xs">
            {repository.private ? "Private" : "Public"}
          </Badge>
        </div>

        {repository.description ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {repository.description}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            No description available
          </p>
        )}

        {repository.fork && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Forked from {repository.full_name.split("/")[0]}
          </p>
        )}

        <div className="flex items-center gap-4 mt-4">
          {repository.language && (
            <div className="flex items-center gap-1">
              <span
                className={`h-3 w-3 rounded-full ${getLanguageColor(
                  repository.language
                )}`}
              />
              <span className="text-xs">{repository.language}</span>
            </div>
          )}

          {repository.stargazers_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Star className="h-3 w-3" />
              <span>{repository.stargazers_count}</span>
            </div>
          )}

          {repository.forks_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <GitFork className="h-3 w-3" />
              <span>{repository.forks_count}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
