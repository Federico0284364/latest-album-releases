import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomLogin from "@/components/CustomLoginButton";
import '@testing-library/jest-dom';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockSignInWithPopup = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock("@/lib/firebase/firestore", () => ({
  auth: {},
  provider: {},
  signInWithPopup: (...args: any[]) => mockSignInWithPopup(...args),
  signOut: (...args: any[]) => mockSignOut(...args),
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: any[]) => mockOnAuthStateChanged(...args),
}));

describe("CustomLogin", () => {
  beforeEach(() => {
    mockSignInWithPopup.mockClear();
    mockSignOut.mockClear();
    mockPush.mockClear();
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      // Default: utente non loggato
      callback(null);
      return jest.fn(); // unsubscribe
    });
  });

  it("renders loading initially", () => {
    let callback: any;
    mockOnAuthStateChanged.mockImplementation((auth, cb) => {
      callback = cb;
      return jest.fn();
    });

    render(<CustomLogin />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    callback(null);
  });

  it("renders login button if user is null", async () => {
    render(<CustomLogin />);
    await waitFor(() => {
      expect(screen.getByText(/Login with Google/i)).toBeInTheDocument();
    });
  });

  it("renders logout button if user exists", async () => {
    const mockUser = { uid: "123", displayName: 'frank' };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(<CustomLogin />);
    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });
  });

  it("calls signInWithPopup when login button is clicked", async () => {
    render(<CustomLogin />);
    const button = await screen.findByText("Login with Google");
    fireEvent.click(button);
    expect(mockSignInWithPopup).toHaveBeenCalled();
  });

  it("calls signOut and router.push when logout button is clicked", async () => {
    const mockUser = { uid: "123" };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    render(<CustomLogin />);
    const button = await screen.findByText("Logout");
    fireEvent.click(button);
    expect(mockSignOut).toHaveBeenCalled();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });
});
