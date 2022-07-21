import { screen, render } from "@testing-library/react";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicCliente } from "../../services/prismic";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const post = {
  slug: "my-new-post",
  title: "my new post",
  content: "<p>post except</p>",
  updatedEt: "March,10",
};

jest.mock("../../services/prismic");
jest.mock("../../services/prismic");
jest.mock("next-auth/react");
jest.mock("next/router");

describe("Preview page", () => {
  it("renders correctly", () => {
    const useSessionMoked = jest.mocked(useSession);

    useSessionMoked.mockReturnValueOnce({
      activeSubscription: null,
    } as any);
    render(<Post post={post} />);

    expect(screen.getByText("my new post")).toBeInTheDocument();
    expect(screen.getByText("post except")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects to full post when user is subscribed", async () => {
    const useSessionMoked = jest.mocked(useSession);
    const useRouterMoked = jest.mocked(useRouter);
    const pushMoked = jest.fn();

    useRouterMoked.mockReturnValueOnce({
      push: pushMoked,
    } as any);
    useSessionMoked.mockReturnValueOnce({
      data: { activeSubscription: "fake-active-subscription" },
    } as any);

    render(<Post post={post} />);

    expect(pushMoked).toBeCalledWith("/posts/my-new-post");
  });

  it("loads inital data", async () => {
    const getPrismicClienteMoked = jest.mocked(getPrismicCliente);

    getPrismicClienteMoked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          Title: "my new post",
          content: [{ type: "paragraph", text: "post except" }],
        },
        last_publication_date: "04/01/2022",
      }),
    } as any);

    const response = await getStaticProps({ params: { slug: "my-new-post" } });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "my new post",
            content: "<p>post except</p>",
            updatedEt: "01 de abril de 2022",
          },
        },
      })
    );
  });
});
