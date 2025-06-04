"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  GitFork,
  Bug,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { githubAPI } from "@/lib/github-api";
import { formatRelativeDate } from "@/lib/formatting";

interface ActivityEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: any;
  created_at: string;
}

interface RecentActivityProps {
  username: string;
}

const getEventIcon = (eventType: string) => {
  const icons: Record<string, React.ReactNode> = {
    PushEvent: <GitCommit className="h-4 w-4" />,
    CreateEvent: <GitBranch className="h-4 w-4" />,
    PullRequestEvent: <GitPullRequest className="h-4 w-4" />,
    IssuesEvent: <Bug className="h-4 w-4" />,
    WatchEvent: <Star className="h-4 w-4" />,
    ForkEvent: <GitFork className="h-4 w-4" />,
    ReleaseEvent: <GitBranch className="h-4 w-4" />,
  };
  return icons[eventType] || <GitCommit className="h-4 w-4" />;
};

const getEventColor = (eventType: string) => {
  const colors: Record<string, string> = {
    PushEvent: "text-blue-500",
    CreateEvent: "text-green-500",
    PullRequestEvent: "text-purple-500",
    IssuesEvent: "text-orange-500",
    WatchEvent: "text-yellow-500",
    ForkEvent: "text-gray-500",
    ReleaseEvent: "text-red-500",
  };
  return colors[eventType] || "text-gray-500";
};

const formatEventDescription = (event: ActivityEvent) => {
  const repoName = event.repo.name.split("/")[1];

  switch (event.type) {
    case "PushEvent":
      const commitCount = event.payload.commits?.length || 1;
      return `Pushed ${commitCount} commit${
        commitCount > 1 ? "s" : ""
      } to ${repoName}`;

    case "CreateEvent":
      const refType = event.payload.ref_type;
      return `Created ${refType} in ${repoName}`;

    case "PullRequestEvent":
      const action = event.payload.action;
      const prNumber = event.payload.pull_request?.number;
      return `${action} pull request #${prNumber} in ${repoName}`;

    case "IssuesEvent":
      const issueAction = event.payload.action;
      const issueNumber = event.payload.issue?.number;
      return `${issueAction} issue #${issueNumber} in ${repoName}`;

    case "WatchEvent":
      return `Starred ${repoName}`;

    case "ForkEvent":
      return `Forked ${repoName}`;

    case "ReleaseEvent":
      const releaseName = event.payload.release?.tag_name;
      return `Released ${releaseName} in ${repoName}`;

    default:
      return `Activity in ${repoName}`;
  }
};

export function RecentActivity({ username }: RecentActivityProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      setIsLoading(true);
      try {
        const eventData = await githubAPI.getUserEvents(username);
        setEvents(eventData.slice(0, 10)); // Show last 10 events
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivity();
  }, [username]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Recent Activity
          <Badge variant="secondary" className="text-xs">
            {events.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <div className={`mt-1 ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatEventDescription(event)}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatRelativeDate(event.created_at)}
                </p>

                <a
                  href={`https://github.com/${event.repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                >
                  {event.repo.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Additional details for some event types */}
              {event.type === "PushEvent" && event.payload.commits && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-2">
                    {event.payload.commits
                      .slice(0, 2)
                      .map((commit: any, index: number) => (
                        <div key={index} className="truncate">
                          • {commit.message}
                        </div>
                      ))}
                    {event.payload.commits.length > 2 && (
                      <div className="text-gray-500">
                        ... and {event.payload.commits.length - 2} more commits
                      </div>
                    )}
                  </div>
                </div>
              )}

              {event.type === "PullRequestEvent" &&
                event.payload.pull_request && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-2">
                      {event.payload.pull_request.title}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}

        <div className="pt-2">
          <a
            href={`https://github.com/${username}?tab=activity`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline flex items-center gap-1"
          >
            View all activity
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
