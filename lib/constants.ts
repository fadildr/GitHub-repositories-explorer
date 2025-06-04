export const API_CONFIG = {
  GITHUB_BASE_URL: "https://api.github.com",
  SEARCH_RESULTS_LIMIT: 5,
  REPOS_LIMIT: 100,
} as const;

export const ERROR_MESSAGES = {
  SEARCH_FAILED: "Failed to search users. Please try again.",
  REPOS_FAILED: "Failed to load repositories. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  RATE_LIMIT: "API rate limit exceeded. Please try again later.",
} as const;

export const DEBOUNCE_DELAY = 300; // ms for search input debouncing