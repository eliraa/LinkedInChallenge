import { test, expect } from "@playwright/test";

test(
  "first product opens and shows product title",
  { tag: "@ChallengeLinkedin" },
  async ({ page }) => {
    // Step 1: Open homepage.
    await page.goto("/");

    // Step 2: Click the first product in the product grid.
    const firstProduct = page.locator('[data-test^="product-"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    // Step 3: Verify product details page is displayed.
    await expect(page).toHaveURL(/\/product\//);
    await expect(page.getByTestId("product-name")).toBeVisible();
  }
);
