import { render } from "@testing-library/react"
import HomePage from "@/app/page"
import { jest } from "@jest/globals"

// Mock window.matchMedia for testing responsive design
function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  })

  window.matchMedia = jest.fn().mockImplementation((query) => {
    const matches =
      query.includes(`(min-width: ${width}px)`) ||
      (query.includes("min-width") && Number.parseInt(query.match(/\d+/)?.[0] || "0") <= width)
    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }
  })

  // Trigger resize event
  window.dispatchEvent(new Event("resize"))
}

describe("Mobile Responsiveness", () => {
  it("renders correctly on mobile devices", () => {
    // Set window width to mobile size (375px - iPhone)
    setWindowWidth(375)

    const { container } = render(<HomePage />)

    // Check that the container has appropriate responsive classes
    expect(container.firstChild).toHaveClass("min-h-screen")

    // We can't fully test CSS media queries in JSDOM, but we can check
    // that the component renders without errors at mobile width
  })

  it("renders correctly on tablet devices", () => {
    // Set window width to tablet size (768px - iPad)
    setWindowWidth(768)

    const { container } = render(<HomePage />)

    // Check that the container has appropriate responsive classes
    expect(container.firstChild).toHaveClass("min-h-screen")
  })

  it("renders correctly on desktop devices", () => {
    // Set window width to desktop size (1280px)
    setWindowWidth(1280)

    const { container } = render(<HomePage />)

    // Check that the container has appropriate responsive classes
    expect(container.firstChild).toHaveClass("min-h-screen")
  })
})
