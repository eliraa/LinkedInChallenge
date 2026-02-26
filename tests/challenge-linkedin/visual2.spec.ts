import { test, expect } from "@playwright/test";
import { urls } from "./config/test-data";

test("test", async ({ page }) => {
  await page.goto(urls.docsBaseUrl);
  await page.getByRole("link", { name: "Community" }).click();
  await page
    .getByLabel("Docs sidebar")
    .getByRole("link", { name: "Ambassadors" })
    .click();
  await expect(page.locator("section")).toContainText("Butch Mayhew");
});
