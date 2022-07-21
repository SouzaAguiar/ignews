import { render } from "@testing-library/react";
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

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});
describe("Header", () => {
  it("render correctly", () => {
    const { getByText } = render(<Header />);

    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Postes")).toBeInTheDocument();
  });
});
