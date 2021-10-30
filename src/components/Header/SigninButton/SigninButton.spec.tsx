import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";
import { SigninButton } from ".";

jest.mock("next-auth/client");

describe("SigninButton component", () => {
  it("SigninButton renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SigninButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("SigninButton renders correctly when user is authenticated", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
      },
      false,
    ]);

    const { debug } = render(<SigninButton />);

    // debug();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
