import { render, screen, fireEvent } from "@testing-library/react";
import { UserList } from "@/components/search/user-list";
import type { GitHubUser } from "@/types/github";
import { jest } from "@jest/globals";

// Mock the Lucide React icons
jest.mock("lucide-react", () => ({
  User: () => <div data-testid="user-icon" />,
  ExternalLink: () => <div data-testid="external-link-icon" />,
}));

describe("UserList Component", () => {
  const mockUsers: GitHubUser[] = [
    {
      id: 1,
      login: "testuser1",
      avatar_url: "https://example.com/avatar1.png",
      html_url: "https://github.com/testuser1",
      type: "User",
      public_repos: 10,
    },
    {
      id: 2,
      login: "testuser2",
      avatar_url: "https://example.com/avatar2.png",
      html_url: "https://github.com/testuser2",
      name: "Test User 2",
      type: "Organization",
      public_repos: 20,
    },
  ];

  const mockOnUserSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeletons when isLoading is true", () => {
    render(
      <UserList users={[]} onUserSelect={mockOnUserSelect} isLoading={true} />
    );

    // Check for skeleton loading elements
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders nothing when users array is empty and not loading", () => {
    const { container } = render(
      <UserList users={[]} onUserSelect={mockOnUserSelect} isLoading={false} />
    );

    // Container should be empty
    expect(container.firstChild).toBeNull();
  });

  it("renders users correctly", () => {
    render(
      <UserList
        users={mockUsers}
        onUserSelect={mockOnUserSelect}
        isLoading={false}
      />
    );

    // Check if user names are rendered
    expect(screen.getByText("testuser1")).toBeInTheDocument();
    expect(screen.getByText("testuser2")).toBeInTheDocument();

    // Check if additional user info is rendered
    expect(screen.getByText("Test User 2")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Organization")).toBeInTheDocument();
    expect(screen.getByText("• 10 repositories")).toBeInTheDocument();
    expect(screen.getByText("• 20 repositories")).toBeInTheDocument();
  });

  it("calls onUserSelect when a user card is clicked", () => {
    render(
      <UserList
        users={mockUsers}
        onUserSelect={mockOnUserSelect}
        isLoading={false}
      />
    );

    // Find the first user card and click it
    const userCards = screen
      .getAllByRole("button")
      .filter((button) => button.textContent?.includes("View Repos"));

    fireEvent.click(userCards[0]);

    expect(mockOnUserSelect).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("opens external link in new tab when external link button is clicked", () => {
    // Mock window.open
    const originalOpen = window.open;
    window.open = jest.fn();

    render(
      <UserList
        users={mockUsers}
        onUserSelect={mockOnUserSelect}
        isLoading={false}
      />
    );

    // Find external link buttons
    const externalLinkButtons = screen
      .getAllByRole("button")
      .filter((button) =>
        button.querySelector('[data-testid="external-link-icon"]')
      );

    // Click the first external link button
    fireEvent.click(externalLinkButtons[0]);

    expect(window.open).toHaveBeenCalledWith(
      "https://github.com/testuser1",
      "_blank"
    );

    // Restore original window.open
    window.open = originalOpen;
  });

  it("displays the correct number of users found", () => {
    render(
      <UserList
        users={mockUsers}
        onUserSelect={mockOnUserSelect}
        isLoading={false}
      />
    );

    expect(
      screen.getByText("Search Results (2 users found)")
    ).toBeInTheDocument();
  });
});
