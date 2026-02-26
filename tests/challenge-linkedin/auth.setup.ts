import { test as setup, expect } from "@playwright/test";
import { users } from "./config/test-data";

// Step 1: Define where authenticated browser state will be saved.
const authFile = "playwright/.auth/customer.json";

setup("authenticate customer", async ({ page }) => {
  const customer = users.customer;

  // Step 2: Open home page and navigate to sign-in.
  await page.goto("/");
  await page.getByTestId("nav-sign-in").click();

  // Step 3: Fill login form with customer credentials.
  await page.getByTestId("email").fill(customer.email);
  await page.getByTestId("password").fill(customer.password);
  await page.getByTestId("login-submit").click();

  // Step 4: Confirm login by checking account menu appears.
  const navMenu = page.getByTestId("nav-menu");
  await expect(navMenu).toBeVisible();
  await expect(navMenu).not.toContainText("Sign in");

  // Step 5: Persist authenticated state for later reuse by tests.
  await page.context().storageState({ path: authFile });
});
