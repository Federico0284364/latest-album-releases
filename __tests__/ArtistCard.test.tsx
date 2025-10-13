import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ArtistCard from "@/components/ArtistCard";
import { artist } from "@/mock/artist";

describe("ArtistCard", () => {
  const imageSrc = "https://via.placeholder.com/150";
  const mockOnFollow = jest.fn();

  const standardProps = {
    artist,
    imageSrc,
    following: false,
    isLoggedIn: true,
    onFollow: mockOnFollow,
    className: undefined as string | undefined,
  };

  beforeEach(() => {
    mockOnFollow.mockClear();
  });

  it("renders artist name and image", () => {
    render(<ArtistCard {...standardProps} />);

    // nome artista
    expect(screen.getByText(artist.name)).toBeInTheDocument();

    // immagine
    const img = screen.getByAltText(artist.name + "image") as HTMLImageElement;
    expect(img).toBeInTheDocument();
  });

  it("renders Follow button if user is logged in and not following", () => {
    render(<ArtistCard {...standardProps} />);

    const button = screen.getByRole("button", { name: /Follow/i });
    expect(button).toBeInTheDocument();
  });

  it("renders Following button if user is logged in and already following", () => {
    render(<ArtistCard {...standardProps} following={true} />);

    const button = screen.getByRole("button", { name: /Following/i });
    expect(button).toBeInTheDocument();
  });

  it("calls onFollow when Follow button is clicked", () => {
    render(<ArtistCard {...standardProps} />);

    const button = screen.getByRole("button", { name: /Follow/i });
    fireEvent.click(button);
    expect(mockOnFollow).toHaveBeenCalledTimes(1);
    expect(mockOnFollow).toHaveBeenCalledWith(artist);
  });

  it("shows message if user is not logged in", () => {
    render(<ArtistCard {...standardProps} isLoggedIn={false} />);

    expect(screen.getByText("You haven't logged in yet")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies extra className to the Card wrapper", () => {
    render(<ArtistCard {...standardProps} className="custom-class" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass("custom-class");
  });
});
