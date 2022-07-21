import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import {} from "ts-jest";
import { SinginButton } from ".";

jest.mock("next-auth/react");

describe("SingInButon component", () => {
  it("render correctly when user not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

    render(<SinginButton />);

    expect(screen.getByText("sing with github")).toBeInTheDocument();
  });

  it("render correctly when user is authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expiress",
      },
      status: "authenticated",
    });
    render(<SinginButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
