import { fireEvent, render, screen } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {} from "ts-jest";
import { mocked } from "jest-mock";
import { SubscribButton } from ".";

jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribButton component", () => {
  it("render correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });
    render(<SubscribButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirect user to singin when not authenticated", () => {
    const signInMocked = jest.mocked(signIn);
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });
    render(<SubscribButton />);
    const subscribButton = screen.getByText("Subscribe now");
    fireEvent.click(subscribButton);
    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already subscription", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "john.doe@exemple.com",
        },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalled();
  });
});
