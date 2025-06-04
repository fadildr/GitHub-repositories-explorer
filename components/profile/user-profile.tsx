"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Users, Heart } from "lucide-react";
import { githubAPI } from "@/lib/github-api";
import { SocialLinks } from "@/components/profile/social-links";
import { ContactInfo } from "@/components/profile/contact-info";
import type { GitHubUser } from "@/types/github";

interface Organization {
  id: number;
  login: string;
  avatar_url: string;
  description?: string;
}

interface Achievement {
  emoji: string;
  title: string;
  color: string;
}

interface UserProfileProps {
  user: GitHubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);

  // Fetch user organizations
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setIsLoadingOrgs(true);
        const orgs = await githubAPI.getUserOrganizations(user.login);
        setOrganizations(orgs);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        setOrganizations([]);
      } finally {
        setIsLoadingOrgs(false);
      }
    }

    fetchOrganizations();
  }, [user.login]);

  // Calculate user achievements
  const getAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [];

    const repos = user.public_repos || 0;
    const followers = user.followers || 0;
    const accountAge =
      new Date().getFullYear() - new Date(user.created_at || "").getFullYear();

    // Repository achievements
    if (repos >= 100) {
      achievements.push({
        emoji: "🏆",
        title: "Repository Master",
        color: "from-yellow-400 to-yellow-600",
      });
    } else if (repos >= 50) {
      achievements.push({
        emoji: "📚",
        title: "Prolific Creator",
        color: "from-blue-500 to-purple-500",
      });
    } else if (repos >= 10) {
      achievements.push({
        emoji: "💻",
        title: "Active Developer",
        color: "from-green-500 to-blue-500",
      });
    }

    // Social achievements
    if (followers >= 1000) {
      achievements.push({
        emoji: "🌟",
        title: "GitHub Celebrity",
        color: "from-pink-500 to-rose-500",
      });
    } else if (followers >= 100) {
      achievements.push({
        emoji: "🚀",
        title: "Influential Developer",
        color: "from-orange-500 to-red-500",
      });
    } else if (followers >= 50) {
      achievements.push({
        emoji: "⭐",
        title: "Notable Contributor",
        color: "from-yellow-500 to-orange-500",
      });
    }

    // Organization achievements
    if (organizations.length >= 5) {
      achievements.push({
        emoji: "🏢",
        title: "Organization Leader",
        color: "from-indigo-500 to-purple-600",
      });
    } else if (organizations.length > 0) {
      achievements.push({
        emoji: "🤝",
        title: "Team Player",
        color: "from-purple-500 to-pink-500",
      });
    }

    // Tenure achievements
    if (accountAge >= 10) {
      achievements.push({
        emoji: "🎂",
        title: "GitHub Veteran",
        color: "from-red-500 to-yellow-500",
      });
    } else if (accountAge >= 5) {
      achievements.push({
        emoji: "🕰️",
        title: "Long-time User",
        color: "from-blue-600 to-indigo-600",
      });
    }

    // Special status
    if (user.hireable) {
      achievements.push({
        emoji: "💼",
        title: "Available for Hire",
        color: "from-emerald-500 to-teal-500",
      });
    }

    if (user.site_admin) {
      achievements.push({
        emoji: "👑",
        title: "GitHub Staff",
        color: "from-amber-500 to-orange-500",
      });
    }

    return achievements.slice(0, 6);
  };

  const achievements = getAchievements();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="h-64 w-64 rounded-full border-4 border-background shadow-lg">
          <AvatarImage src={user.avatar_url} alt={user.login} />
          <AvatarFallback>
            <User className="h-32 w-32" />
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.name || user.login}
          </h1>
          <h2 className="text-lg text-gray-500 dark:text-gray-400">
            {user.login}
          </h2>

          {user.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>

        <div className="w-full flex gap-2">
          <Button variant="outline" className="flex-1">
            Follow
          </Button>
          <Button variant="default" className="flex-1">
            <Heart className="h-4 w-4 mr-2" />
            Sponsor
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span>
            <strong className="text-gray-900 dark:text-gray-100">
              {user.followers || 0}
            </strong>{" "}
            followers
          </span>
          <span>·</span>
          <span>
            <strong className="text-gray-900 dark:text-gray-100">
              {user.following || 0}
            </strong>{" "}
            following
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <ContactInfo user={user} />

      {/* Social Links */}
      <SocialLinks user={user} />

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Achievements
              <Badge variant="secondary" className="text-xs">
                {achievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`h-16 w-16 rounded-full bg-gradient-to-br ${achievement.color} 
                    flex items-center justify-center text-white font-bold text-2xl 
                    cursor-pointer hover:scale-105 transition-transform shadow-md 
                    hover:shadow-lg`}
                  title={achievement.title}
                >
                  {achievement.emoji}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organizations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Organizations
            {organizations.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {organizations.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingOrgs ? (
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : organizations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {organizations.slice(0, 6).map((org) => (
                <a
                  key={org.id}
                  href={`https://github.com/${org.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity group"
                  title={org.description || org.login}
                >
                  <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                    <AvatarImage src={org.avatar_url} alt={org.login} />
                    <AvatarFallback className="text-xs">
                      {org.login.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </a>
              ))}
              {organizations.length > 6 && (
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                  +{organizations.length - 6}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No organizations
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
