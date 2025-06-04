import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput } from "@/components/search/search-input";
import { jest } from "@jest/globals";

describe("SearchInput Component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<SearchInput onSearch={mockOnSearch} isLoading={false} />);

    expect(
      screen.getByPlaceholderText("Search GitHub users...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    render(<SearchInput onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Search GitHub users...");
    fireEvent.change(input, { target: { value: "test" } });

    expect(input).toHaveValue("test");
  });

  it("calls onSearch when form is submitted", () => {
    render(<SearchInput onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Search GitHub users...");
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("calls onSearch when Enter key is pressed", () => {
    render(<SearchInput onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Search GitHub users...");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("disables input and button when loading", () => {
    render(<SearchInput onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText("Search GitHub users...");
    const button = screen.getByRole("button");

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("shows loading indicator when isLoading is true", () => {
    render(<SearchInput onSearch={mockOnSearch} isLoading={true} />);

    // The loading indicator is an SVG with a specific class
    const loadingIndicator = document.querySelector(".animate-spin");
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("disables the button when input is empty", () => {
    render(<SearchInput onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    const input = screen.getByPlaceholderText("Search GitHub users...");
    fireEvent.change(input, { target: { value: "test" } });

    expect(button).not.toBeDisabled();
  });
});
