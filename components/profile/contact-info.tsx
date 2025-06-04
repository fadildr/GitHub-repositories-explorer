"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building,
  Calendar,
  Clock,
  Users,
  GitFork,
  BookOpen,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/formatting";
import type { GitHubUser } from "@/types/github";

interface ContactInfoProps {
  user: GitHubUser;
}

export function ContactInfo({ user }: ContactInfoProps) {
  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getAccountAge = () => {
    if (!user.created_at) return null;
    const joinDate = new Date(user.created_at);
    const now = new Date();
    const years = now.getFullYear() - joinDate.getFullYear();
    return years;
  };

  const getUserType = () => {
    if (user.site_admin) return "Staff";
    if ((user.followers || 0) > 1000) return "Popular Developer";
    if ((user.public_repos || 0) > 50) return "Active Developer";
    if ((user.followers || 0) > 100) return "Contributor";
    return "Developer";
  };

  const getActivityLevel = () => {
    const repos = user.public_repos || 0;
    const followers = user.followers || 0;
    const following = user.following || 0;

    const activityScore = repos * 2 + followers + following * 0.5;

    if (activityScore > 200)
      return { level: "Very Active", color: "bg-green-500" };
    if (activityScore > 100) return { level: "Active", color: "bg-blue-500" };
    if (activityScore > 50)
      return { level: "Moderate", color: "bg-yellow-500" };
    return { level: "Beginner", color: "bg-gray-500" };
  };

  const activity = getActivityLevel();
  const accountAge = getAccountAge();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Contact & Info
          <Badge variant="secondary" className="text-xs">
            {getUserType()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-3">
          {user.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.location}
              </span>
            </div>
          )}

          {user.company && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {user.company}
              </span>
            </div>
          )}

          {user.created_at && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                Joined {formatJoinDate(user.created_at)}
                {accountAge && accountAge > 0 && (
                  <span className="text-gray-500 ml-1">
                    ({accountAge} years ago)
                  </span>
                )}
              </span>
            </div>
          )}

          {user.updated_at && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                Last active {formatRelativeDate(user.updated_at)}
              </span>
            </div>
          )}
        </div>

        {/* Activity Level */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Activity Level
            </span>
            <Badge className={`text-xs text-white ${activity.color}`}>
              {activity.level}
            </Badge>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BookOpen className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Repos</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.public_repos || 0}
              </div>
            </div>

            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <GitFork className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Gists</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user.public_gists || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Followers/Following */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Network</span>
            </div>
            <div className="text-gray-500">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {user.followers || 0}
              </span>{" "}
              followers ·{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {user.following || 0}
              </span>{" "}
              following
            </div>
          </div>
        </div>

        {/* Hireable Status */}
        {user.hireable !== null && (
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Available for hire
              </span>
              <Badge
                variant={user.hireable ? "default" : "secondary"}
                className="text-xs"
              >
                {user.hireable ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        )}

        {/* Contact Button */}
        <div className="pt-3">
          <Button variant="outline" className="w-full" size="sm">
            Contact {user.login}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
