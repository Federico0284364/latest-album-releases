import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button";

describe("Button", () => {
  const mockOnClick = jest.fn();

  const standardProps = {
    children: "Click Me",
    onClick: mockOnClick,
    variant: "secondary" as const,
    size: "md" as const,
    className: undefined as string | undefined,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("renders the button with children text", () => {
    render(<Button {...standardProps} />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("applies extra className", () => {
    render(<Button {...standardProps} className="custom-class" />);
    const btn = screen.getByText("Click Me");
    expect(btn).toHaveClass("custom-class");
  });

  it("applies correct variant class for primary", () => {
    render(<Button {...standardProps} variant="primary" />);
    const btn = screen.getByText("Click Me");
    expect(btn).toHaveClass("bg-fg text-dark");
  });

  it("applies correct variant class for danger", () => {
    render(<Button {...standardProps} variant="danger" />);
    const btn = screen.getByText("Click Me");
    expect(btn).toHaveClass("bg-red-500 text-white");
  });

  it("applies correct size class for lg", () => {
    render(<Button {...standardProps} size="lg" />);
    const btn = screen.getByText("Click Me");
    expect(btn).toHaveClass("text-xl px-4 py-2");
  });

  it("calls onClick handler when clicked", () => {
    render(<Button {...standardProps} />);
    const btn = screen.getByText("Click Me");
    fireEvent.click(btn);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders children correctly when variant and size are overridden", () => {
    render(
      <Button {...standardProps} variant="important" size="xl">
        Important
      </Button>
    );
    const btn = screen.getByText("Important");
    expect(btn).toHaveClass("bg-important text-fg");
    expect(btn).toHaveClass("text-2xl px-6 py-3 font-semibold");
  });
});
