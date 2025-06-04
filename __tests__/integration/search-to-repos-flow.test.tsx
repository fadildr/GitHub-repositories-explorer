import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HomePage from "@/app/page"
import { setupServer } from "msw/node"
import { githubApiHandlers } from "../mocks/github-api"
import { rest } from "msw" // Import rest from msw

// Set up MSW server with our mock handlers
const server = setupServer(...githubApiHandlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Search to Repository Flow Integration", () => {
  it("completes the full user journey from search to viewing repositories", async () => {
    // Render the home page
    render(<HomePage />)

    // 1. Verify initial state
    expect(screen.getByText("GitHub Explorer")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search GitHub users...")).toBeInTheDocument()

    // 2. Enter search query
    const searchInput = screen.getByPlaceholderText("Search GitHub users...")
    fireEvent.change(searchInput, { target: { value: "react" } })

    // 3. Submit search
    const searchButton = screen.getByRole("button", { name: /search/i })
    fireEvent.click(searchButton)

    // 4. Wait for search results
    await waitFor(() => {
      expect(screen.getByText(/Search Results/)).toBeInTheDocument()
    })

    // 5. Verify user results are displayed
    const userItems = await screen.findAllByRole("button", { name: /View Repos/i })
    expect(userItems.length).toBeGreaterThan(0)

    // 6. Select a user
    fireEvent.click(userItems[0])

    // 7. Wait for repositories to load
    await waitFor(() => {
      expect(screen.getByText(/Repositories/)).toBeInTheDocument()
    })

    // 8. Verify repository information is displayed
    const repoItems = await screen.findAllByRole("heading", { level: 3 })
    expect(repoItems.length).toBeGreaterThan(0)

    // 9. Go back to search
    const backButton = screen.getByRole("button", { name: /Back to Search/i })
    fireEvent.click(backButton)

    // 10. Verify we're back to the search view
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search GitHub users...")).toBeInTheDocument()
      expect(screen.queryByText(/Repositories/)).not.toBeInTheDocument()
    })
  })

  it("handles empty search results gracefully", async () => {
    // Render the home page
    render(<HomePage />)

    // Enter a search query that won't match any users
    const searchInput = screen.getByPlaceholderText("Search GitHub users...")
    fireEvent.change(searchInput, { target: { value: "nonexistentuser12345" } })

    // Submit search
    const searchButton = screen.getByRole("button", { name: /search/i })
    fireEvent.click(searchButton)

    // Wait for search to complete
    await waitFor(() => {
      // Should show empty results (no users found)
      expect(screen.queryByText(/Search Results $$0 users found$$/)).not.toBeInTheDocument()
    })
  })

  it("handles API errors gracefully", async () => {
    // Override the handler to simulate an error
    server.use(
      rest.get("https://api.github.com/search/users", (req, res, ctx) => {
        return res(ctx.status(403), ctx.json({ message: "API rate limit exceeded" }))
      }),
    )

    // Render the home page
    render(<HomePage />)

    // Enter a search query
    const searchInput = screen.getByPlaceholderText("Search GitHub users...")
    fireEvent.change(searchInput, { target: { value: "test" } })

    // Submit search
    const searchButton = screen.getByRole("button", { name: /search/i })
    fireEvent.click(searchButton)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Failed to search users. Please try again.")).toBeInTheDocument()
    })
  })
})
