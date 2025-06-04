"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HomePage from "@/app/page"
import { setupServer } from "msw/node"
import { rest } from "msw"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the components to simplify testing
jest.mock("@/components/search-input", () => ({
  SearchInput: ({ onSearch }: { onSearch: (query: string) => void }) => (
    <div data-testid="search-input">
      <input data-testid="search-input-field" onChange={(e) => {}} placeholder="Search GitHub users..." />
      <button data-testid="search-button" onClick={() => onSearch("testuser")}>
        Search
      </button>
    </div>
  ),
}))

jest.mock("@/components/user-list", () => ({
  UserList: ({
    users,
    onUserSelect,
    isLoading,
  }: {
    users: any[]
    onUserSelect: (user: any) => void
    isLoading: boolean
  }) => (
    <div data-testid="user-list">
      {isLoading ? (
        <div data-testid="user-list-loading">Loading...</div>
      ) : (
        <>
          <div>Users found: {users.length}</div>
          {users.map((user) => (
            <div key={user.id} data-testid="user-item">
              <span>{user.login}</span>
              <button onClick={() => onUserSelect(user)}>Select</button>
            </div>
          ))}
        </>
      )}
    </div>
  ),
}))

jest.mock("@/components/repository-list", () => ({
  RepositoryList: ({
    user,
    repositories,
    isLoading,
    error,
    onBack,
  }: {
    user: any
    repositories: any[]
    isLoading: boolean
    error: string | null
    onBack: () => void
  }) => (
    <div data-testid="repository-list">
      {isLoading ? (
        <div data-testid="repository-list-loading">Loading repositories...</div>
      ) : error ? (
        <div data-testid="repository-list-error">{error}</div>
      ) : (
        <>
          <div>User: {user.login}</div>
          <div>Repositories: {repositories.length}</div>
          <button onClick={onBack}>Back</button>
        </>
      )}
    </div>
  ),
}))

// Mock GitHub API responses
const mockUsers = [
  { id: 1, login: "testuser1", avatar_url: "url1", html_url: "html_url1", type: "User" },
  { id: 2, login: "testuser2", avatar_url: "url2", html_url: "html_url2", type: "User" },
]

const mockRepositories = [
  {
    id: 1,
    name: "repo1",
    full_name: "testuser1/repo1",
    description: "Test repo 1",
    html_url: "repo_url1",
    language: "JavaScript",
    stargazers_count: 10,
    forks_count: 5,
    watchers_count: 3,
    updated_at: "2023-01-01T00:00:00Z",
    created_at: "2022-01-01T00:00:00Z",
    private: false,
    fork: false,
  },
  {
    id: 2,
    name: "repo2",
    full_name: "testuser1/repo2",
    description: "Test repo 2",
    html_url: "repo_url2",
    language: "TypeScript",
    stargazers_count: 20,
    forks_count: 10,
    watchers_count: 6,
    updated_at: "2023-02-01T00:00:00Z",
    created_at: "2022-02-01T00:00:00Z",
    private: false,
    fork: false,
  },
]

// Set up MSW server
const server = setupServer(
  rest.get("https://api.github.com/search/users", (req, res, ctx) => {
    return res(
      ctx.json({
        items: mockUsers,
      }),
    )
  }),

  rest.get("https://api.github.com/users/testuser1/repos", (req, res, ctx) => {
    return res(ctx.json(mockRepositories))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("HomePage Integration", () => {
  it("renders the search input initially", () => {
    render(<HomePage />)

    expect(screen.getByTestId("search-input")).toBeInTheDocument()
    expect(screen.queryByTestId("repository-list")).not.toBeInTheDocument()
  })

  it("searches for users and displays results", async () => {
    render(<HomePage />)

    // Trigger search
    fireEvent.click(screen.getByTestId("search-button"))

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText("Users found: 2")).toBeInTheDocument()
    })

    // Check if users are displayed
    expect(screen.getAllByTestId("user-item").length).toBe(2)
  })

  it("shows loading state during search", async () => {
    // Delay the API response to ensure we can see loading state
    server.use(
      rest.get("https://api.github.com/search/users", (req, res, ctx) => {
        return res(
          ctx.delay(100),
          ctx.json({
            items: mockUsers,
          }),
        )
      }),
    )

    render(<HomePage />)

    // Trigger search
    fireEvent.click(screen.getByTestId("search-button"))

    // Check for loading state
    expect(screen.getByTestId("user-list-loading")).toBeInTheDocument()

    // Wait for results
    await waitFor(() => {
      expect(screen.queryByTestId("user-list-loading")).not.toBeInTheDocument()
    })
  })

  it("selects a user and displays repositories", async () => {
    render(<HomePage />)

    // Trigger search
    fireEvent.click(screen.getByTestId("search-button"))

    // Wait for search results
    await waitFor(() => {
      expect(screen.getAllByTestId("user-item").length).toBe(2)
    })

    // Select the first user
    const selectButtons = screen.getAllByText("Select")
    fireEvent.click(selectButtons[0])

    // Check for loading state
    expect(screen.getByTestId("repository-list-loading")).toBeInTheDocument()

    // Wait for repositories to load
    await waitFor(() => {
      expect(screen.getByText("User: testuser1")).toBeInTheDocument()
      expect(screen.getByText("Repositories: 2")).toBeInTheDocument()
    })
  })

  it("handles API errors during search", async () => {
    // Mock an error response
    server.use(
      rest.get("https://api.github.com/search/users", (req, res, ctx) => {
        return res(ctx.status(403), ctx.json({ message: "API rate limit exceeded" }))
      }),
    )

    render(<HomePage />)

    // Trigger search
    fireEvent.click(screen.getByTestId("search-button"))

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Failed to search users. Please try again.")).toBeInTheDocument()
    })
  })

  it("handles API errors when fetching repositories", async () => {
    // First, successful user search
    render(<HomePage />)

    // Trigger search
    fireEvent.click(screen.getByTestId("search-button"))

    // Wait for search results
    await waitFor(() => {
      expect(screen.getAllByTestId("user-item").length).toBe(2)
    })

    // Mock an error for repository fetch
    server.use(
      rest.get("https://api.github.com/users/testuser1/repos", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Internal server error" }))
      }),
    )

    // Select the first user
    const selectButtons = screen.getAllByText("Select")
    fireEvent.click(selectButtons[0])

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId("repository-list-error")).toBeInTheDocument()
      expect(screen.getByText("Failed to load repositories. Please try again.")).toBeInTheDocument()
    })
  })

  it("navigates back from repository view to search", async () => {
    render(<HomePage />)

    // Trigger search
    fireEvent.click(screen.getByTestId("search-button"))

    // Wait for search results
    await waitFor(() => {
      expect(screen.getAllByTestId("user-item").length).toBe(2)
    })

    // Select the first user
    const selectButtons = screen.getAllByText("Select")
    fireEvent.click(selectButtons[0])

    // Wait for repositories to load
    await waitFor(() => {
      expect(screen.getByText("User: testuser1")).toBeInTheDocument()
    })

    // Click back button
    fireEvent.click(screen.getByText("Back"))

    // Check if we're back to search view
    expect(screen.getByTestId("search-input")).toBeInTheDocument()
    expect(screen.queryByTestId("repository-list")).not.toBeInTheDocument()
  })
})
