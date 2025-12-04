import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginButton from "@/components/CustomLoginButton";
import { auth, provider, signInWithPopup } from "@/lib/firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import '@testing-library/jest-dom';

// Mock Firebase functions
jest.mock("@/lib/firebase/firestore", () => ({
  auth: {},
  provider: {},
  signInWithPopup: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

describe("LoginButton component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render nothing while loading", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      return jest.fn();
    });

    const { container } = render(<LoginButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render nothing if the user is logged in", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: "123", displayName: "Federico" }); // mock user
      return jest.fn();
    });

    const { container } = render(<LoginButton />);
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it("should show the login button if no user is logged in", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb(null);
      return jest.fn();
    });

    render(<LoginButton />);

    expect(await screen.findByText("Login with Google")).toBeInTheDocument();
  });

  it("should call signInWithPopup when login button is clicked", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb(null);
      return jest.fn();
    });

    render(<LoginButton />);

    const button = await screen.findByText("Login with Google");
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, provider);
    });
  });

  it("should handle login errors gracefully", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb(null);
      return jest.fn();
    });

    (signInWithPopup as jest.Mock).mockRejectedValueOnce(new Error("Login error"));

    render(<LoginButton />);
    const button = await screen.findByText("Login with Google");
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });
});
