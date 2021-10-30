import { render , screen} from "@testing-library/react";
import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

describe("Header component", () => {
  it("Headers renders correctly", () => {
    const { debug, getByText } = render(<Header />);

    // screen.logTestingPlaygroundURL();

    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Posts")).toBeInTheDocument();
  });
});