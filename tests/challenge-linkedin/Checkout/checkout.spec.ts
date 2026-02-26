import { test } from "@playwright/test";
import { checkoutAddress } from "../config/test-data";
import { AppNavigation } from "../pom/navigation/AppNavigation";
import { CheckoutPage } from "../pom/pages/CheckoutPage";

test.describe.configure({ mode: "serial" });

test(
  "Logged in user adds to cart and completes checkout with cash on delivery",
  { tag: "@ChallengeLinkedin" },
  async ({ page }) => {
    const nav = new AppNavigation(page);
    const checkout = new CheckoutPage(page);

    await nav.goHome();
    await nav.expectLoggedIn();
    await checkout.openFirstProduct();
    await checkout.addCurrentProductToCart();
    await nav.goToCart();
    await checkout.proceedFromCart();
    await checkout.proceedFromSignInIfPresent();
    await checkout.fillBillingAddress(checkoutAddress);
    await checkout.proceedToPayment();
    await checkout.selectPaymentMethod("cash-on-delivery");
    await checkout.finish();
  }
);



