import { test } from "@playwright/test";
import { users } from "../config/test-data";
import { AppNavigation } from "../pom/navigation/AppNavigation";
import { CheckoutPage } from "../pom/pages/CheckoutPage";
import { ProductCatalogPage } from "../pom/pages/ProductCatalogPage";

test.describe.configure({ mode: "serial" });

test(
  "Guest checkout redirects to login, then proceeds after sign in",
  { tag: "@ChallengeLinkedin" },
  async ({ browser }) => {
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();
    const guestNav = new AppNavigation(guestPage);
    const guestCatalog = new ProductCatalogPage(guestPage);
    const guestCheckout = new CheckoutPage(guestPage);
    const customer = users.customer;

    // 1) Go to page
    await guestNav.goHome();

    // 2) Click first item
    await guestCatalog.openFirstProduct();

    // 3) Click add to cart
    await guestCheckout.addCurrentProductToCart();

    // 4) Go to cart
    await guestNav.goToCart();

    // 5) Proceed and expect login form
    await guestCheckout.proceedFromCart();
    await guestCheckout.expectLoginStepVisible();

    // 6) Login and expect proceed-2
    await guestCheckout.login(customer.email, customer.password);
    await guestCheckout.expectProceed2Visible();

    await guestContext.close();
  }
);
