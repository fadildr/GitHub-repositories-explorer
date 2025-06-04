export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  type: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  location?: string;
  blog?: string;
  bio?: string;
  company?: string;
  email?: string;
  twitter_username?: string;
  created_at?: string;
  public_gists?: number;
  hireable?: boolean;
  site_admin?: boolean;
  updated_at?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  size: number;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  created_at: string;
  topics?: string[];
  private: boolean;
  fork: boolean;
  parent?: {
    full_name: string;
    html_url: string;
  };
  homepage?: string;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

// Extended types untuk fitur dinamis
export interface GitHubOrganization {
  id: number;
  login: string;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string | null;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: any;
  public: boolean;
  created_at: string;
}

export interface ContributionDay {
  date: Date;
  count: number;
  level: number;
  color: string;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  averagePerDay: number;
}

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
  earned: boolean;
  earnedDate?: string;
}

export interface UserStats {
  repositories: number;
  gists: number;
  followers: number;
  following: number;
  organizations: number;
  yearsActive: number;
}
