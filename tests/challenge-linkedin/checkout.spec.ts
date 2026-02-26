import { test, expect } from "@playwright/test";
import { checkoutAddress } from "./config/test-data";

// Reuse authenticated session created by tests/auth.setup.ts.
test.use({ storageState: "playwright/.auth/customer.json" });

test(
  "Logged in user adds to cart and completes checkout with cash on delivery",
  { tag: "@ChallengeLinkedin" },
  async ({ page }) => {
    // Step 1: Open homepage and verify session is already authenticated.
    await page.goto("/");
    const navMenu = page.getByTestId("nav-menu");
    await expect(navMenu).toBeVisible();
    await expect(page.getByTestId("nav-sign-in")).toHaveCount(0);

    // Step 2: Click first product.
    const firstProduct = page.locator('[data-test^="product-"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/product\//);

    // Step 3: Add product to cart.
    const addToCartButton = page.getByTestId("add-to-cart");
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    await expect(page.getByText("Product added to shopping cart.")).toBeVisible();

    // Step 4: Open checkout from cart icon (no manual refresh/navigation).
    const cartButton = page.getByTestId("nav-cart");
    await expect(cartButton).toBeVisible();
    await Promise.all([page.waitForURL(/\/checkout/), cartButton.click()]);

    // Step 5: Move from cart/login step to billing address step.
    const proceedStep1 = page.getByTestId("proceed-1");
    if (await proceedStep1.isVisible()) {
      await proceedStep1.click();
    }

    const proceedStep2 = page.getByTestId("proceed-2");
    await expect(proceedStep2).toBeVisible();
    await proceedStep2.click();

    // Step 6: Fill billing address.
    await expect(page.getByTestId("street")).toBeVisible();
    await page.getByTestId("street").fill(checkoutAddress.street);
    await page.getByTestId("city").fill(checkoutAddress.city);
    await page.getByTestId("state").fill(checkoutAddress.state);
    await page.getByTestId("country").fill(checkoutAddress.country);
    await page.getByTestId("postal_code").fill(checkoutAddress.postalCode);

    // Step 7: Continue to payment and complete order.
    const proceedStep3 = page.getByTestId("proceed-3");
    await expect(proceedStep3).toBeVisible();
    await proceedStep3.click();

    await expect(page.getByTestId("payment-method")).toBeVisible();
    await page.getByTestId("payment-method").selectOption("cash-on-delivery");

    const confirmButton = page.getByTestId("finish");
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    await expect(page.getByTestId("payment-success-message")).toBeVisible();
  }
);
