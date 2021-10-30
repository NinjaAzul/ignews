import { render,screen } from "@testing-library/react";
import { ActiveLink } from ".";
//MOCK = imitação de uma funcionalidade necessario no test.
jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink component", () => {
  test("active link renders correctly", () => {
     render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    // debug(); // retorna o html;

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("active link is receiving active class", () => {
    const { debug, getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );
    expect(getByText("Home")).toHaveClass("active");
  });

  // test("active link is not receiving active class", () => {
  //   const { debug, getByText } = render(
  //     <ActiveLink href="/" activeClassName="active">
  //       <a>Home</a>
  //     </ActiveLink>
  //   );
  //   expect(getByText("Home")).toHaveClass("");
  // });
});
