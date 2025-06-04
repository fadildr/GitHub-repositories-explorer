"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import { getLanguageColor } from "@/lib/formatting";
import type { GitHubRepository } from "@/types/github";

interface LanguageStatsProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
}

interface LanguageData {
  name: string;
  count: number;
  percentage: number;
  totalBytes: number;
  color: string;
}

export function LanguageStats({ repositories, isLoading }: LanguageStatsProps) {
  const [showAll, setShowAll] = useState(false);

  const languageStats = useMemo(() => {
    if (!repositories.length) return [];

    // Count languages from repositories
    const languageCount: Record<string, number> = {};
    const languageBytes: Record<string, number> = {};

    repositories.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        // Simulate bytes based on repository size (GitHub API doesn't provide language bytes in repo list)
        languageBytes[repo.language] =
          (languageBytes[repo.language] || 0) + (repo.size || 0);
      }
    });

    const totalRepos = Object.values(languageCount).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalBytes = Object.values(languageBytes).reduce(
      (sum, bytes) => sum + bytes,
      0
    );

    const stats: LanguageData[] = Object.entries(languageCount)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalRepos) * 100,
        totalBytes: languageBytes[name] || 0,
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.count - a.count);

    return stats;
  }, [repositories]);

  const displayedLanguages = showAll
    ? languageStats
    : languageStats.slice(0, 5);
  const topLanguage = languageStats[0];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-1" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (languageStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No languages detected
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Languages
          </div>
          {topLanguage && (
            <Badge variant="secondary" className="text-xs">
              {topLanguage.name} {topLanguage.percentage.toFixed(1)}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Language breakdown */}
        <div className="space-y-3">
          {displayedLanguages.map((lang) => (
            <div key={lang.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${lang.color}`} />
                  <span className="font-medium">{lang.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <span>{lang.percentage.toFixed(1)}%</span>
                  <span>({lang.count} repos)</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${lang.color}`}
                  style={{ width: `${lang.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Show more/less button */}
        {languageStats.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full text-sm"
          >
            {showAll
              ? "Show less"
              : `Show ${languageStats.length - 5} more languages`}
          </Button>
        )}

        {/* Quick stats */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{languageStats.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Languages
              </div>
            </div>
            <div>
              <div className="text-lg font-bold">{repositories.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Repositories
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
