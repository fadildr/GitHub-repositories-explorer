import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import HomePage from "@/app/page"
import { setupServer } from "msw/node"
import { githubApiHandlers } from "../mocks/github-api"

// Set up MSW server with our mock handlers
const server = setupServer(...githubApiHandlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Keyboard Navigation Integration", () => {
  it("allows searching with keyboard (Enter key)", async () => {
    const user = userEvent.setup()

    // Render the home page
    render(<HomePage />)

    // Focus the search input
    const searchInput = screen.getByPlaceholderText("Search GitHub users...")
    await user.click(searchInput)

    // Type a search query
    await user.type(searchInput, "react")

    // Press Enter to submit
    await user.keyboard("{Enter}")

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText(/Search Results/)).toBeInTheDocument()
    })

    // Verify user results are displayed
    const userItems = await screen.findAllByRole("button", { name: /View Repos/i })
    expect(userItems.length).toBeGreaterThan(0)
  })

  it("supports keyboard navigation through search results", async () => {
    const user = userEvent.setup()

    // Render the home page
    render(<HomePage />)

    // Search for users
    const searchInput = screen.getByPlaceholderText("Search GitHub users...")
    await user.click(searchInput)
    await user.type(searchInput, "react")
    await user.keyboard("{Enter}")

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText(/Search Results/)).toBeInTheDocument()
    })

    // Tab to the first "View Repos" button
    await user.tab() // Focus first interactive element

    // Keep tabbing until we reach a "View Repos" button
    let viewReposButton = null
    for (let i = 0; i < 10; i++) {
      await user.tab()
      if (document.activeElement?.textContent?.includes("View Repos")) {
        viewReposButton = document.activeElement
        break
      }
    }

    expect(viewReposButton).not.toBeNull()

    // Press Enter to select the user
    await user.keyboard("{Enter}")

    // Wait for repositories to load
    await waitFor(() => {
      expect(screen.getByText(/Repositories/)).toBeInTheDocument()
    })

    // Tab to the "Back to Search" button
    await user.tab() // Focus first interactive element

    // Keep tabbing until we reach the "Back to Search" button
    let backButton = null
    for (let i = 0; i < 10; i++) {
      if (document.activeElement?.textContent?.includes("Back to Search")) {
        backButton = document.activeElement
        break
      }
      await user.tab()
    }

    expect(backButton).not.toBeNull()

    // Press Enter to go back
    await user.keyboard("{Enter}")

    // Verify we're back to the search view
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search GitHub users...")).toBeInTheDocument()
    })
  })
})
