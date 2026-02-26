import { test, expect } from "@playwright/test";
import { checkoutAddress } from "./config/test-data";

test(
  "Logged out user sees login, then authenticated checkout completes",
  { tag: "@ChallengeLinkedin" },
  async ({ browser }) => {
    // Step 1: Start as a logged-out user and add an item to cart.
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();

    await guestPage.goto("/");
    const guestFirstProduct = guestPage.locator('[data-test^="product-"]').first();
    await expect(guestFirstProduct).toBeVisible();
    await guestFirstProduct.click();
    await expect(guestPage).toHaveURL(/\/product\//);

    const guestAddToCart = guestPage.getByTestId("add-to-cart");
    await expect(guestAddToCart).toBeVisible();
    await guestAddToCart.click();
    await expect(guestPage.getByText("Product added to shopping cart.")).toBeVisible();

    const guestCartButton = guestPage.getByTestId("nav-cart");
    await expect(guestCartButton).toBeVisible();
    await guestCartButton.click();
    await expect(guestPage).toHaveURL(/\/checkout/);

    // Step 2: Clicking proceed should show login for logged-out users.
    const guestProceedStep1 = guestPage.getByTestId("proceed-1");
    await expect(guestProceedStep1).toBeVisible();
    await guestProceedStep1.click();
    await expect(guestPage.getByTestId("login-submit")).toBeVisible();

    await guestContext.close();

    // Step 3: Use auth setup storage state and repeat checkout flow as logged-in user.
    const authContext = await browser.newContext({
      storageState: "playwright/.auth/customer.json",
    });
    const authPage = await authContext.newPage();

    await authPage.goto("/");
    const authFirstProduct = authPage.locator('[data-test^="product-"]').first();
    await expect(authFirstProduct).toBeVisible();
    await authFirstProduct.click();
    await expect(authPage).toHaveURL(/\/product\//);

    const authAddToCart = authPage.getByTestId("add-to-cart");
    await expect(authAddToCart).toBeVisible();
    await authAddToCart.click();
    await expect(authPage.getByText("Product added to shopping cart.")).toBeVisible();

    const authCartButton = authPage.getByTestId("nav-cart");
    await expect(authCartButton).toBeVisible();
    await authCartButton.click();
    await expect(authPage).toHaveURL(/\/checkout/);

    const authProceedStep1 = authPage.getByTestId("proceed-1");
    if (await authProceedStep1.isVisible()) {
      await authProceedStep1.click();
    }

    const authProceedStep2 = authPage.getByTestId("proceed-2");
    await expect(authProceedStep2).toBeVisible();
    await authProceedStep2.click();

    await expect(authPage.getByTestId("street")).toBeVisible();
    await authPage.getByTestId("street").fill(checkoutAddress.street);
    await authPage.getByTestId("city").fill(checkoutAddress.city);
    await authPage.getByTestId("state").fill(checkoutAddress.state);
    await authPage.getByTestId("country").fill(checkoutAddress.country);
    await authPage.getByTestId("postal_code").fill(checkoutAddress.postalCode);

    const authProceedStep3 = authPage.getByTestId("proceed-3");
    await expect(authProceedStep3).toBeVisible();
    await authProceedStep3.click();

    await expect(authPage.getByTestId("payment-method")).toBeVisible();
    await authPage.getByTestId("payment-method").selectOption("cash-on-delivery");

    const authConfirmButton = authPage.getByTestId("finish");
    await expect(authConfirmButton).toBeVisible();
    await authConfirmButton.click();

    await expect(authPage.getByTestId("payment-success-message")).toBeVisible();

    await authContext.close();
  }
);
