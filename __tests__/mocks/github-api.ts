import { rest } from "msw"
import type { GitHubUser, GitHubRepository } from "@/types/github"

// Mock user data
export const mockUsers: GitHubUser[] = [
  {
    id: 1,
    login: "johndoe",
    avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    html_url: "https://github.com/johndoe",
    name: "John Doe",
    type: "User",
    public_repos: 15,
    followers: 100,
    following: 50,
  },
  {
    id: 2,
    login: "janedoe",
    avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
    html_url: "https://github.com/janedoe",
    name: "Jane Doe",
    type: "User",
    public_repos: 25,
    followers: 200,
    following: 75,
  },
  {
    id: 3,
    login: "reactjs",
    avatar_url: "https://avatars.githubusercontent.com/u/6412038?v=4",
    html_url: "https://github.com/reactjs",
    name: "React",
    type: "Organization",
    public_repos: 40,
    followers: 15000,
    following: 0,
  },
]

// Mock repository data
export const mockRepositories: Record<string, GitHubRepository[]> = {
  johndoe: [
    {
      id: 101,
      name: "awesome-project",
      full_name: "johndoe/awesome-project",
      description: "An awesome project with lots of features",
      html_url: "https://github.com/johndoe/awesome-project",
      language: "TypeScript",
      stargazers_count: 120,
      forks_count: 35,
      watchers_count: 10,
      updated_at: "2023-05-15T10:30:00Z",
      created_at: "2022-01-10T08:15:00Z",
      topics: ["typescript", "react", "nextjs"],
      private: false,
      fork: false,
    },
    {
      id: 102,
      name: "utils-library",
      full_name: "johndoe/utils-library",
      description: "A collection of utility functions",
      html_url: "https://github.com/johndoe/utils-library",
      language: "JavaScript",
      stargazers_count: 45,
      forks_count: 12,
      watchers_count: 5,
      updated_at: "2023-04-20T14:45:00Z",
      created_at: "2022-03-05T11:20:00Z",
      topics: ["javascript", "utils", "helpers"],
      private: false,
      fork: false,
    },
  ],
  janedoe: [
    {
      id: 201,
      name: "data-visualization",
      full_name: "janedoe/data-visualization",
      description: "Interactive data visualization components",
      html_url: "https://github.com/janedoe/data-visualization",
      language: "TypeScript",
      stargazers_count: 230,
      forks_count: 65,
      watchers_count: 25,
      updated_at: "2023-06-01T09:10:00Z",
      created_at: "2022-02-15T13:40:00Z",
      topics: ["typescript", "d3", "visualization", "react"],
      private: false,
      fork: false,
    },
  ],
  reactjs: [
    {
      id: 301,
      name: "react",
      full_name: "reactjs/react",
      description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      html_url: "https://github.com/reactjs/react",
      language: "JavaScript",
      stargazers_count: 200000,
      forks_count: 40000,
      watchers_count: 5000,
      updated_at: "2023-06-10T15:30:00Z",
      created_at: "2013-05-24T16:15:00Z",
      topics: ["javascript", "library", "ui", "frontend"],
      private: false,
      fork: false,
    },
    {
      id: 302,
      name: "reactjs.org",
      full_name: "reactjs/reactjs.org",
      description: "The React documentation website",
      html_url: "https://github.com/reactjs/reactjs.org",
      language: "JavaScript",
      stargazers_count: 10000,
      forks_count: 5000,
      watchers_count: 800,
      updated_at: "2023-06-08T11:20:00Z",
      created_at: "2017-07-30T09:45:00Z",
      topics: ["documentation", "website", "react"],
      private: false,
      fork: false,
    },
  ],
}

// GitHub API handlers for MSW
export const githubApiHandlers = [
  // Search users endpoint
  rest.get("https://api.github.com/search/users", (req, res, ctx) => {
    const query = req.url.searchParams.get("q")

    if (!query) {
      return res(ctx.status(400), ctx.json({ message: "Missing query parameter" }))
    }

    // Filter users based on query
    const filteredUsers = mockUsers.filter((user) => user.login.toLowerCase().includes(query.toLowerCase())).slice(0, 5) // Limit to 5 users

    return res(
      ctx.status(200),
      ctx.json({
        total_count: filteredUsers.length,
        incomplete_results: false,
        items: filteredUsers,
      }),
    )
  }),

  // Get user repositories endpoint
  rest.get("https://api.github.com/users/:username/repos", (req, res, ctx) => {
    const { username } = req.params

    if (typeof username !== "string") {
      return res(ctx.status(400), ctx.json({ message: "Invalid username" }))
    }

    const userRepos = mockRepositories[username.toLowerCase()]

    if (!userRepos) {
      return res(ctx.status(404), ctx.json({ message: "User not found" }))
    }

    return res(ctx.status(200), ctx.json(userRepos))
  }),
]
