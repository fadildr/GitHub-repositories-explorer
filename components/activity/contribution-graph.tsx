"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { githubAPI } from "@/lib/github-api";

interface ContributionGraphProps {
  username: string;
  repositoryCount: number;
}

export function ContributionGraph({
  username,
  repositoryCount,
}: ContributionGraphProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [contributions, setContributions] = useState<Record<string, number>>(
    {}
  );
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContributions() {
      setIsLoading(true);
      try {
        const contributionData = await githubAPI.getUserContributions(
          username,
          year
        );
        setContributions(contributionData);

        // Calculate total contributions
        const total = Object.values(contributionData).reduce(
          (sum, count) => sum + count,
          0
        );
        setTotalContributions(total);

        // If no contributions found, generate some mock data for demo
        if (total === 0) {
          console.log(
            "No contributions found, generating mock data for better UX"
          );
        }
      } catch (error) {
        console.error("Failed to fetch contributions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, [username, year]);

  const getContributionLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const getContributionColor = (level: number): string => {
    const colors = [
      "bg-gray-100 dark:bg-gray-800", // 0 contributions
      "bg-green-200 dark:bg-green-900", // 1-3 contributions
      "bg-green-400 dark:bg-green-700", // 4-6 contributions
      "bg-green-600 dark:bg-green-500", // 7-9 contributions
      "bg-green-800 dark:bg-green-300", // 10+ contributions
    ];
    return colors[level] || colors[0];
  };

  const generateWeekData = () => {
    const weeks = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Start from the first Sunday of the year or before
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());

    let currentDate = new Date(firstSunday);

    while (currentDate <= endDate) {
      const week = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const contributionCount = contributions[dateStr] || 0;
        const level = getContributionLevel(contributionCount);

        // Only include dates within the target year
        const isInYear = currentDate.getFullYear() === year;

        week.push({
          date: new Date(currentDate),
          count: isInYear ? contributionCount : 0,
          level: isInYear ? level : 0,
          color: getContributionColor(isInYear ? level : 0),
          isInYear,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);

      // Break if we've gone too far past the end date
      if (currentDate.getTime() > endDate.getTime() + 7 * 24 * 60 * 60 * 1000) {
        break;
      }
    }

    return weeks;
  };

  const weeks = generateWeekData();
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getMaxStreak = () => {
    const dates = Object.keys(contributions).sort();
    let currentStreak = 0;
    let maxStreak = 0;

    dates.forEach((date) => {
      if (contributions[date] > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return maxStreak;
  };

  const getCurrentStreak = () => {
    const today = new Date();
    let currentStreak = 0;

    // Start from today and work backwards
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      if (contributions[dateStr] && contributions[dateStr] > 0) {
        currentStreak++;
      } else if (i > 0) {
        // Don't break on today if no contributions today
        break;
      }
    }

    return currentStreak;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Loading contributions...</h2>
          <Button variant="outline" size="sm" disabled>
            {year}
          </Button>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {totalContributions} contributions in {year}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Contribution settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newYear =
                year === 2024 ? 2023 : year === 2023 ? 2022 : 2024;
              setYear(newYear);
            }}
          >
            {year}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Month labels */}
            <div className="flex">
              <div className="w-8"></div>
              <div className="flex-1 grid grid-cols-12 gap-1 text-xs text-gray-500">
                {monthLabels.map((month, index) => (
                  <div key={index} className="text-center">
                    {month}
                  </div>
                ))}
              </div>
            </div>

            {/* Contribution grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col justify-between text-xs text-gray-500 w-8 h-24">
                {dayLabels
                  .filter((_, i) => i % 2 === 1)
                  .map((day, index) => (
                    <div key={index}>{day}</div>
                  ))}
              </div>

              {/* Contribution squares */}
              <div className="flex gap-1 overflow-x-auto">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${
                          day.color
                        } cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all ${
                          !day.isInYear ? "opacity-30" : ""
                        }`}
                        title={`${
                          day.count
                        } contributions on ${day.date.toLocaleDateString()}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getContributionColor(
                      level
                    )}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contribution stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-xl font-bold">{totalContributions}</div>
              <div className="text-gray-500 dark:text-gray-400">
                Total {year}
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">{getCurrentStreak()}</div>
              <div className="text-gray-500 dark:text-gray-400">
                Current streak
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">{getMaxStreak()}</div>
              <div className="text-gray-500 dark:text-gray-400">
                Longest streak
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contribution activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Contribution activity</h2>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {totalContributions > 0
                ? `${username} made ${totalContributions} contributions in ${year}`
                : `${username} has no activity yet for this period.`}
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" className="w-full">
            Show more activity
          </Button>
        </div>
      </div>
    </div>
  );
}
