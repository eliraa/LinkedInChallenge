import { test, expect } from "@playwright/test";
import { ProductsApi } from "../pom/api/ProductsApi";

test(
  "product/{id} endpoint returns current product details",
  { tag: "@ChallengeLinkedin" },
  async ({ request }) => {
    const productsApi = new ProductsApi(request);
    const productId = await productsApi.getValidProductId();
    const details = await productsApi.getProductById(productId);

    expect(details.id).toBe(productId);
    expect(details.name.trim().length).toBeGreaterThan(0);
    expect(typeof details.price).toBe("number");
  }
);

