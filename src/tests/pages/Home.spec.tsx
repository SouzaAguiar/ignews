import { screen, render } from "@testing-library/react";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("next-auth/react", () => {
  return {
    useSession: () => [null, false],
  };
});

jest.mock("../../services/stripe");
describe("home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceid: "fake priceId", amount: "R$10,00" }} />);

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });
  it("loads initial data", async () => {
    const retivestripePricesMocked = jest.mocked(stripe.prices.retrieve);
    retivestripePricesMocked.mockResolvedValueOnce({
      id: "fake-id",
      unit_amount: 1000,
    } as any);
    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
