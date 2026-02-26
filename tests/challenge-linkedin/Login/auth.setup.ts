import fs from "fs";
import path from "path";
import { test as setup, expect } from "@playwright/test";
import { users } from "../config/test-data";

const authDir = path.resolve(process.cwd(), ".auth");
const authFile = path.resolve(authDir, "customer.json");

setup("authenticate customer", { tag: "@setup" }, async ({ page }) => {
  const customer = users.customer;

  await page.goto("/");
  await page.getByTestId("nav-sign-in").click();

  await page.getByTestId("email").fill(customer.email);
  await page.getByTestId("password").fill(customer.password);
  await page.getByTestId("login-submit").click();

  const navMenu = page.getByTestId("nav-menu");
  await expect(navMenu).toBeVisible();
  await expect(navMenu).not.toContainText("Sign in");

  fs.mkdirSync(authDir, { recursive: true });
  fs.rmSync(authFile, { force: true });

  await page.context().storageState({ path: authFile });
});

