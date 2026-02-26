import { expect, Locator, Page } from "@playwright/test";

export class AppNavigation {
  private page: Page;
  readonly navMenu: Locator;
  readonly navCart: Locator;
  readonly navSignIn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navMenu = page.getByTestId("nav-menu");
    this.navCart = page.getByTestId("nav-cart");
    this.navSignIn = page.getByTestId("nav-sign-in");
  }

  async goHome(): Promise<void> {
    await this.page.goto("/");
  }

  async goToCart(): Promise<void> {
    await expect(this.navCart).toBeVisible();
    await this.navCart.click();
    await this.page.waitForURL(/\/checkout/);
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.navMenu).toBeVisible();
    await expect(this.navSignIn).toHaveCount(0);
  }
}
