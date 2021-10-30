  
  JAMStack => Javascript - API - Markup.

Headles|CMS (CONTENT MANAGEMENT SYSTEM, API HTTP,GRAPHQL, SDK )

 Examples CMS: 

- Wordpress

  Examples Headles: 
FREE:
- Strapi (API REST || GRAPHQL) generico.
- Ghost (BLOG)
- Keystone (API REST || GRAPHQL) generico.

PAGOS:
- GraphCMS ()
- Prismic CMS(- Dinheiro)
- ContentFull (+ Dinheiro)

- Snopify (Ecomerce)
- Saleor (Ecomerce)


Methods Pagamentos:

- Stripe (pagamentos)

# Testes no Front-End

- configurando jest

```hash
yarn add jest jest-dom @testing-library/jest-dom @testing-library/dom @testing-library/react babel-jest -D
```

- criar arquivo jest.config.js

```js
module.exports = {
  testPathIgnorePatterns: ["/node_modules", "/.next/"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  }
};

```

- criar pasta chamada tests
- criar arquivo setupTest.ts

```ts
//tras algumas funcionalidades a mais para usar o jest na DOM do front-end;
import "@testing-library/jest-dom/extend-expect"

```

- criar arquivo babel

```
module.exports = {
  presets: ["next/babel"]
}
```

- primeiro teste

criar arquivo:

```js
=> .spec.tsx ou test.tsx

Example:

import { render } from "@testing-library/react";
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
    const { debug, getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    // debug(); // retorna o html;

    expect(getByText("Home")).toBeInTheDocument();
  });

  it("active link is receiving active class", () => {
    const { debug, getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );
    expect(getByText("Home")).toHaveClass("active");
  });
});

```

- instlar lib para trablhar coms os estilos do test

```
yarn add identity-obj-proxy -D
```

```
- component Async Example:

```
import {render,screen, waitFor , waitForElementToBeRemoved} from "@testing-library/react"
import { Component } from "."

- query => procuram elemento e não da erros se não char

- get => se não encontrar da erro

- find => procuram elemento e da erros se não char

test("it renders correctly", async () => {

  render(<Component/>)

  expect(screen.getByText("Hello Word")).toBeInDocument() ==> return true becuse is static
  expect(await screen.findByText("Button", { },  {timeout: 2000})).toBeInDocument()  ==> await component render for testing

  await waitForElementToBeRemoved(screen.getByText("Button")))

  await waitFor(() => {
    return expect(screen.getByText("Button")).toBeInDocument()) ==> await component render for testing
  },{timeout: 2000})
})

```