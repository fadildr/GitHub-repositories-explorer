// Date formatting utilities
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

// Number formatting utilities
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

// URL formatting utilities
export const formatBlogUrl = (blog: string): string => {
  return blog.startsWith("http") ? blog : `https://${blog}`;
};

export const formatGitHubUrl = (username: string): string => {
  return `https://github.com/${username}`;
};

// Language color mapping
export const getLanguageColor = (language: string | null): string => {
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
    PHP: "bg-indigo-500",
    Ruby: "bg-red-600",
    "C++": "bg-blue-700",
    "C#": "bg-green-600",
    Vue: "bg-green-500",
    React: "bg-blue-400",
  };

  return colors[language] || "bg-gray-500";
};
