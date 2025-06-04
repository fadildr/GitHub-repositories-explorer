import { render, screen, fireEvent } from "@testing-library/react";
import { RepositoryList } from "@/components/repository/repository-list";
import type { GitHubUser, GitHubRepository } from "@/types/github";
import jest from "jest"; // Import jest to fix the undeclared variable error

// Mock the Lucide React icons
jest.mock("lucide-react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Star: () => <div data-testid="star-icon" />,
  GitFork: () => <div data-testid="git-fork-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  User: () => <div data-testid="user-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
}));

describe("RepositoryList Component", () => {
  const mockUser: GitHubUser = {
    id: 1,
    login: "testuser",
    avatar_url: "https://example.com/avatar.png",
    html_url: "https://github.com/testuser",
    name: "Test User",
    type: "User",
    public_repos: 30,
    followers: 100,
    following: 50,
  };

  const mockRepositories: GitHubRepository[] = [
    {
      id: 1,
      name: "repo1",
      full_name: "testuser/repo1",
      description: "Test repository 1",
      html_url: "https://github.com/testuser/repo1",
      language: "JavaScript",
      stargazers_count: 10,
      forks_count: 5,
      watchers_count: 8,
      updated_at: "2023-01-01T00:00:00Z",
      created_at: "2022-01-01T00:00:00Z",
      topics: ["javascript", "react", "testing"],
      private: false,
      fork: false,
    },
    {
      id: 2,
      name: "repo2",
      full_name: "testuser/repo2",
      description: null,
      html_url: "https://github.com/testuser/repo2",
      language: "TypeScript",
      stargazers_count: 20,
      forks_count: 10,
      watchers_count: 15,
      updated_at: "2023-02-01T00:00:00Z",
      created_at: "2022-02-01T00:00:00Z",
      topics: ["typescript", "nextjs"],
      private: false,
      fork: true,
    },
  ];

  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user information correctly", () => {
    render(
      <RepositoryList
        user={mockUser}
        repositories={mockRepositories}
        isLoading={false}
        error={null}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("30 repositories")).toBeInTheDocument();
    expect(screen.getByText("100 followers")).toBeInTheDocument();
    expect(screen.getByText("50 following")).toBeInTheDocument();
  });

  it("renders repositories correctly", () => {
    render(
      <RepositoryList
        user={mockUser}
        repositories={mockRepositories}
        isLoading={false}
        error={null}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("Repositories (2)")).toBeInTheDocument();
    expect(screen.getByText("repo1")).toBeInTheDocument();
    expect(screen.getByText("repo2")).toBeInTheDocument();
    expect(screen.getByText("Test repository 1")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders loading skeletons when isLoading is true", () => {
    render(
      <RepositoryList
        user={mockUser}
        repositories={[]}
        isLoading={true}
        error={null}
        onBack={mockOnBack}
      />
    );

    // Check for skeleton loading elements
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error message when error is provided", () => {
    const errorMessage = "Failed to load repositories";
    render(
      <RepositoryList
        user={mockUser}
        repositories={[]}
        isLoading={false}
        error={errorMessage}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders empty state when no repositories are found", () => {
    render(
      <RepositoryList
        user={mockUser}
        repositories={[]}
        isLoading={false}
        error={null}
        onBack={mockOnBack}
      />
    );

    expect(
      screen.getByText("No repositories found for this user.")
    ).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    render(
      <RepositoryList
        user={mockUser}
        repositories={mockRepositories}
        isLoading={false}
        error={null}
        onBack={mockOnBack}
      />
    );

    const backButton = screen.getByText("Back to Search");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it("formats dates correctly", () => {
    render(
      <RepositoryList
        user={mockUser}
        repositories={mockRepositories}
        isLoading={false}
        error={null}
        onBack={mockOnBack}
      />
    );

    // Check for formatted dates (this depends on the locale, so we check for parts)
    expect(screen.getByText(/Updated Jan 1, 2023/)).toBeInTheDocument();
    expect(screen.getByText(/Updated Feb 1, 2023/)).toBeInTheDocument();
  });

  it("renders repository topics correctly", () => {
    render(
      <RepositoryList
        user={mockUser}
        repositories={mockRepositories}
        isLoading={false}
        error={null}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByText("javascript")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
  });
});
