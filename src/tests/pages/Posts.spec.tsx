import { screen, render } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicCliente } from "../../services/prismic";

const posts = [
  {
    slug: "my-new-post",
    title: "my new post",
    except: "post except",
    updatedEt: "March,10",
  },
];

jest.mock("../../services/prismic");
describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("my new post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClienteMocked = jest.mocked(getPrismicCliente);

    getPrismicClienteMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-new-post",
            data: {
              Title: "my new post",
              content: [{ type: "paragraph", text: "post except" }],
            },
            last_publication_date: "04-01-2021",
          },
        ],
      }),
    } as any);
    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-new-post",
              title: "my new post",
              except: "post except",
              updatedEt: "01 de abril de 2021",
            },
          ],
        },
      })
    );
  });
});
