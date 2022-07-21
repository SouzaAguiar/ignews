import { screen, render } from "@testing-library/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicCliente } from "../../services/prismic";
import { getSession } from "next-auth/react";

const post = {
  slug: "my-new-post",
  title: "my new post",
  content: "<p>post except</p>",
  updatedEt: "March,10",
};

jest.mock("../../services/prismic");
jest.mock("../../services/prismic");
jest.mock("next-auth/react");
describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("my new post")).toBeInTheDocument();
    expect(screen.getByText("post except")).toBeInTheDocument();
  });

  it("redirects user if not subscribe is faund", async () => {
    const getSessionMoked = jest.mocked(getSession);

    getSessionMoked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("loads inital data", async () => {
    const getSessionMoked = jest.mocked(getSession);
    const getPrismicClienteMoked = jest.mocked(getPrismicCliente);

    getSessionMoked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    getPrismicClienteMoked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          Title: "my new post",
          content: [{ type: "paragraph", text: "post except" }],
        },
        last_publication_date: "04/01/2022",
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

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
