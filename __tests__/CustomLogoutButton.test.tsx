import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogoutButton from "@/components/CustomLogoutButton";
import { auth, signOut } from "@/lib/firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import '@testing-library/jest-dom';

// Mock Firebase and Next.js router
jest.mock("@/lib/firebase/firestore", () => ({
  auth: {},
  signOut: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LogoutButton component", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("should render nothing while loading", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      // Do not call callback yet → loading stays true
      return jest.fn();
    });

    const { container } = render(<LogoutButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing if no user is logged in", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb(null); // no user
      return jest.fn();
    });

    const { container } = render(<LogoutButton />);
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it("should show the logout button if the user is logged in", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: "123", displayName: "Federico" }); // mock user
      return jest.fn();
    });

    render(<LogoutButton />);
    expect(await screen.findByText("Logout")).toBeInTheDocument();
  });

  it("should call signOut and redirect when logout button is clicked", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: "123" });
      return jest.fn();
    });

    render(<LogoutButton />);
    const button = await screen.findByText("Logout");
    fireEvent.click(button);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("should handle logout errors gracefully", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: "123" });
      return jest.fn();
    });

    (signOut as jest.Mock).mockRejectedValueOnce(new Error("Logout error"));

    render(<LogoutButton />);
    const button = await screen.findByText("Logout");
    fireEvent.click(button);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
