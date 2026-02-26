import { test, expect } from "@playwright/test";
import { urls } from "./config/test-data";

type ProductSummary = {
  id: string;
  name: string;
  in_stock: boolean;
  is_rental: boolean;
};

type ProductsResponse = {
  data: ProductSummary[];
};

type ProductDetailsResponse = {
  id: string;
  name: string;
  price: number;
};

test(
  "product/{id} endpoint returns current product details",
  { tag: "@ChallengeLinkedin" },
  async ({ request }) => {
    // Step 1: Request current product list from API.
    const listResponse = await request.get(`${urls.apiBaseUrl}/products`, {
      params: {
        page: 1,
        between: "price,1,100",
        is_rental: false,
      },
    });

    // Step 2: Validate list request succeeded and parse payload.
    expect(listResponse.ok()).toBeTruthy();
    const listData = (await listResponse.json()) as ProductsResponse;

    // Step 3: Pick a currently valid product id from the list.
    const currentProduct = listData.data.find(
      (product) => product.in_stock && !product.is_rental
    );
    expect(currentProduct, "No suitable product returned by /products").toBeTruthy();

    // Step 4: Request product details for the selected id.
    const detailsResponse = await request.get(
      `${urls.apiBaseUrl}/products/${currentProduct!.id}`
    );

    // Step 5: Validate detail response and assert core fields.
    expect(detailsResponse.ok()).toBeTruthy();
    const details = (await detailsResponse.json()) as ProductDetailsResponse;

    expect(details.id).toBe(currentProduct!.id);
    expect(details.name).toBeTruthy();
    expect(details.price).toBeGreaterThan(0);
  }
);
