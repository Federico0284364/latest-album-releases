import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Card from "@/components/Card";

describe("Card", () => {
  const standardProps = {
    children: <p>Card Content</p>,
    className: undefined as string | undefined,
  };

  it("renders children correctly", () => {
    render(<Card {...standardProps} />);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("applies extra className", () => {
    render(<Card {...standardProps} className="custom-class" />);
    const card = screen.getByText("Card Content").closest("div");
    expect(card).toHaveClass("custom-class");
  });

  it("renders multiple children correctly", () => {
    render(
      <Card>
        <p>Child 1</p>
        <p>Child 2</p>
      </Card>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("passes additional HTML props to the div", () => {
    render(
      <Card data-testid="card" id="test-card" aria-label="my-card">
        Card Content
      </Card>
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("id", "test-card");
    expect(card).toHaveAttribute("aria-label", "my-card");
  });

  it("supports motion props", () => {
    render(
      <Card initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="motion-card">
        Animated
      </Card>
    );
    const card = screen.getByTestId("motion-card");
    expect(card).toBeInTheDocument();
  });
});
